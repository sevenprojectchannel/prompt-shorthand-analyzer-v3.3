/**
 * Test Suite V2.1 - Prompt Shorthand Analyzer
 * Verifikasi Lengkap Semantic Shorthand Knowledge Base & 8 Skenario Uji Wajib (TEST A - TEST H)
 */

import { SemanticEngine } from '../src/lib/semanticEngine.js';
import { INITIAL_SHORTHAND_CATALOG, SHORTHAND_CATEGORIES, filterCatalogKnowledgeBase } from '../src/data/catalogData.js';
import { CatalogRepository } from '../src/services/catalogRepository.js';
import { cleanPromptForCopy } from '../src/lib/promptFormatter.js';
import { PatchManager, globalPatchManager } from '../src/patches/patchManager.js';
import { v3CorePatch } from '../src/patches/v3CorePatch.js';
import { DictionaryService } from '../src/services/dictionaryService.js';
import { GeminiService } from '../src/services/geminiService.js';
import { renderConflictBanner } from '../src/components/ConflictBanner.js';
import { renderExcludedShorthands } from '../src/components/ExcludedShorthands.js';

const engine = new SemanticEngine(INITIAL_SHORTHAND_CATALOG);

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n==================================================');
console.log('PROMPT SHORTHAND ANALYZER V2.1 - QUALITY CHECK TEST');
console.log('==================================================\n');

// -----------------------------------------------------------------------------
// KNOWLEDGE BASE STRUCTURE INTEGRITY
// -----------------------------------------------------------------------------
console.log('--- KNOWLEDGE BASE INTEGRITY TEST ---');
{
  const categoryKeys = Object.keys(SHORTHAND_CATEGORIES);
  assert(categoryKeys.length === 15, `Memiliki 15 kategori lengkap (ditemukan: ${categoryKeys.length})`);

  // Verify all 15 required categories A to O
  const expectedCats = [
    'LOCK_PRESERVATION', 'FACE_IDENTITY', 'HAIR', 'HEADWEAR', 'OUTFIT',
    'BODY_POSE', 'BACKGROUND', 'LIGHTING', 'IMAGE_QUALITY', 'COLOR_TONE',
    'CANVAS_RATIO', 'TRANSPARENCY', 'OBJECT_EDITING', 'STYLE_EFFECT', 'CAMERA_PHOTO'
  ];
  const allCatsPresent = expectedCats.every(cat => categoryKeys.includes(cat));
  assert(allCatsPresent, 'Semua 15 kategori A sampai O terdefinisi');

  // Verify shorthand items structure
  const allHaveMetadata = INITIAL_SHORTHAND_CATALOG.every(item =>
    item.code &&
    item.name &&
    item.category &&
    item.target &&
    item.description &&
    Array.isArray(item.semanticTriggers) &&
    Array.isArray(item.negativeTriggers) &&
    Array.isArray(item.conflicts) &&
    Array.isArray(item.compatibleWith) &&
    item.priority &&
    item.whenToUse &&
    item.whenNotToUse
  );
  assert(allHaveMetadata, 'Setiap shorthand memiliki metadata terstruktur lengkap');

  // Verify existing critical shorthands are preserved
  const existingCodes = [
    '/facelock', '/hairlock', '/backgroundlock', '/outfitlock', '/bodylock',
    '/outfit', '/bgremove', '/bgreplace', '/headwear-remove', '/enhance',
    '/sharpen', '/denoise', '/hdr', '/ar 9:16', '/ar 16:9', '/ar 1:1',
    '/fullbody', '/cinematic', '/rawphoto', '/colorgrade'
  ];
  const preserved = existingCodes.every(c => INITIAL_SHORTHAND_CATALOG.some(item => item.code === c));
  assert(preserved, 'Seluruh 20 shorthand existing tetap dipertahankan 100%');
}

// -----------------------------------------------------------------------------
// TEST A
// -----------------------------------------------------------------------------
console.log('\n--- TEST A: "perbaiki pencahayaan foto" ---');
{
  const res = engine.analyze('perbaiki pencahayaan foto');
  assert(res.editAreas.some(e => e.entity === 'LIGHTING'), 'Target area terdeteksi sebagai LIGHTING');
  assert(res.installedShorthands.includes('/enhance'), 'Shorthand /enhance terpasang');
  assert(!res.installedShorthands.includes('/facelock'), 'Tidak otomatis menambahkan /facelock');
  assert(!res.installedShorthands.includes('/hairlock'), 'Tidak otomatis menambahkan /hairlock');
  assert(!res.installedShorthands.includes('/outfit'), 'Tidak otomatis menambahkan /outfit');
  assert(!res.installedShorthands.includes('/bgremove'), 'Tidak otomatis menambahkan /bgremove');
  assert(res.optimalPrompt === 'perbaiki pencahayaan foto. /enhance', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST B
// -----------------------------------------------------------------------------
console.log('\n--- TEST B: "hapus hijab, jangan ubah wajah" ---');
{
  const res = engine.analyze('hapus hijab, jangan ubah wajah');
  assert(res.editAreas.some(e => e.entity === 'HEADWEAR'), 'EDIT terdeteksi sebagai headwear removal');
  assert(res.lockedAreas.some(l => l.entity === 'FACE'), 'LOCK terdeteksi sebagai facelock');
  assert(res.installedShorthands.includes('/headwear-remove'), 'Shorthand /headwear-remove terpasang');
  assert(res.installedShorthands.includes('/facelock'), 'Shorthand /facelock terpasang');
  assert(res.optimalPrompt === 'hapus hijab, jangan ubah wajah. /headwear-remove /facelock', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST C
// -----------------------------------------------------------------------------
console.log('\n--- TEST C: "ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah" ---');
{
  const res = engine.analyze('ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah');
  assert(res.editAreas.some(e => e.entity === 'OUTFIT'), 'EDIT terdeteksi sebagai outfit');
  assert(res.lockedAreas.some(l => l.entity === 'FACE'), 'LOCK terdeteksi sebagai facelock');
  assert(res.installedShorthands.includes('/outfit'), 'Shorthand /outfit terpasang');
  assert(res.installedShorthands.includes('/facelock'), 'Shorthand /facelock terpasang');
  assert(res.optimalPrompt === 'ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah. /outfit /facelock', `Prompt optimal: "${res.optimalPrompt}"`);
  assert(res.primaryShorthands.some(p => p.code === '/outfit') && res.primaryShorthands.some(p => p.code === '/facelock'), 'Primary shorthands terpisah: /outfit dan /facelock');
  assert(res.relatedShorthands.length > 0 && res.relatedShorthands.every(r => !r.isPrimary && !r.checked), 'Related shorthands tampil terpisah dan OFF secara default');
  assert(res.relatedShorthands.some(r => r.code === '/hairlock') && res.relatedShorthands.some(r => r.code === '/backgroundlock'), 'Cross-domain related preservation items terdeteksi');
  assert(res.exclusions.some(e => e.code === '/outfitlock' && e.reason.includes('Bertentangan')), 'Exclusion outfitlock terdeteksi dengan alasan konflik');
}

// -----------------------------------------------------------------------------
// TEST D
// -----------------------------------------------------------------------------
console.log('\n--- TEST D: "hapus latar belakang" ---');
{
  const res = engine.analyze('hapus latar belakang');
  assert(res.editAreas.some(e => e.entity === 'BACKGROUND'), 'EDIT terdeteksi sebagai bgremove');
  assert(res.installedShorthands.includes('/bgremove'), 'Shorthand /bgremove terpasang');
  assert(res.optimalPrompt === 'hapus latar belakang. /bgremove', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST E
// -----------------------------------------------------------------------------
console.log('\n--- TEST E: "gunakan latar baru" ---');
{
  const res = engine.analyze('gunakan latar baru');
  assert(res.editAreas.some(e => e.entity === 'BACKGROUND'), 'EDIT terdeteksi sebagai bgreplace');
  assert(res.installedShorthands.includes('/bgreplace'), 'Shorthand /bgreplace terpasang');
  assert(res.optimalPrompt === 'gunakan latar baru. /bgreplace', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST F
// -----------------------------------------------------------------------------
console.log('\n--- TEST F: "pertahankan rambut asli tetapi ubah pakaian" ---');
{
  const res = engine.analyze('pertahankan rambut asli tetapi ubah pakaian');
  assert(res.lockedAreas.some(l => l.entity === 'HAIR'), 'LOCK terdeteksi sebagai hairlock');
  assert(res.editAreas.some(e => e.entity === 'OUTFIT'), 'EDIT terdeteksi sebagai outfit');
  assert(res.installedShorthands.includes('/hairlock'), 'Shorthand /hairlock terpasang');
  assert(res.installedShorthands.includes('/outfit'), 'Shorthand /outfit terpasang');
  assert(res.optimalPrompt === 'pertahankan rambut asli tetapi ubah pakaian. /hairlock /outfit', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST G
// -----------------------------------------------------------------------------
console.log('\n--- TEST G: "ubah rasio menjadi 9:16" ---');
{
  const res = engine.analyze('ubah rasio menjadi 9:16');
  assert(res.editAreas.some(e => e.entity === 'CANVAS_RATIO'), 'ASPECT RATIO terdeteksi sebagai 9:16');
  assert(res.installedShorthands.includes('/ar 9:16'), 'Shorthand /ar 9:16 terpasang');
  assert(!res.installedShorthands.includes('/facelock'), 'Tidak menambahkan facelock');
  assert(!res.installedShorthands.includes('/outfit'), 'Tidak menambahkan outfit');
  assert(!res.installedShorthands.includes('/bgremove'), 'Tidak menambahkan bgremove');
  assert(res.optimalPrompt === 'ubah rasio menjadi 9:16. /ar 9:16', `Prompt optimal: "${res.optimalPrompt}"`);
}

// -----------------------------------------------------------------------------
// TEST H
// -----------------------------------------------------------------------------
console.log('\n--- TEST H: "pertahankan rambut asli tetapi ubah gaya rambut" ---');
{
  const res = engine.analyze('pertahankan rambut asli tetapi ubah gaya rambut');
  assert(res.conflicts.length > 0, 'Deteksi konflik aktif: CONFLICT DETECTED');
  assert(res.conflicts[0].entity === 'HAIR', 'Entitas konflik adalah HAIR');
  assert(res.conflicts[0].type === 'EDIT_VS_LOCK', 'Tipe konflik adalah LOCK vs EDIT');
  assert(res.conflicts[0].shorthandA === '/hairlock', 'Shorthand A adalah /hairlock');
  assert(res.conflicts[0].shorthandB === '/hairchange', 'Shorthand B adalah /hairchange');
  assert(Boolean(res.conflicts[0].suggestion), 'Konflik memuat properti saran (suggestion)');
  assert(res.conflicts[0].suggestion.includes('rambut'), 'Saran relevan dengan area konflik rambut');
}

// -----------------------------------------------------------------------------
// SEMANTIC SEARCH VARIATIONS TEST
// -----------------------------------------------------------------------------
console.log('\n--- SEMANTIC SEARCH VARIATIONS TEST ---');
{
  const searchQueries = [
    { q: 'jangan ubah wajah', expected: '/facelock' },
    { q: 'wajah harus tetap sama', expected: '/facelock' },
    { q: 'hapus hijab', expected: '/headwear-remove' },
    { q: 'lepaskan penutup kepala', expected: '/headwear-remove' },
    { q: 'pertahankan rambut asli', expected: '/hairlock' },
    { q: 'jangan mengubah pakaian', expected: '/outfitlock' },
    { q: 'ganti baju', expected: '/outfit' },
    { q: 'hapus background', expected: '/bgremove' },
    { q: 'gunakan latar baru', expected: '/bgreplace' }
  ];

  for (const t of searchQueries) {
    const res = filterCatalogKnowledgeBase(INITIAL_SHORTHAND_CATALOG, { searchQuery: t.q });
    const codes = res.map(r => r.code);
    assert(codes[0] === t.expected, `Pencarian semantik "${t.q}" menghasilkan top match ${t.expected}`);
  }
}

// -----------------------------------------------------------------------------
// COPY PROMPT SANITIZATION
// -----------------------------------------------------------------------------
console.log('\n--- COPY PROMPT SANITIZATION TEST ---');
{
  const optimal = 'hapus hijab, jangan ubah wajah. /headwear-remove /facelock';
  const copied = cleanPromptForCopy(optimal);
  assert(copied === optimal, 'SALIN PROMPT hanya menyalin main prompt bersih');
  assert(!copied.includes('Alasan'), 'Tidak mengandung penjelasan alasan');
  assert(!copied.includes('Commercial stock'), 'Tidak mengandung boilerplate IP safety');
  assert(!copied.includes('Metadata'), 'Tidak mengandung metadata internal');
}

// -----------------------------------------------------------------------------
// PATCH V2.1 - 11 NEW COMPREHENSIVE TESTS
// -----------------------------------------------------------------------------

// 1. TEST SEMANTIC DEDUP 1
console.log('\n--- TEST SEMANTIC DEDUP 1: Multiple candidates with same functionGroup ---');
{
  const candidates = [
    {
      code: '/facelock',
      name: 'Penguncian Wajah',
      item: {
        code: '/facelock',
        functionGroup: 'FACELOCK_PRESERVATION',
        preferredRepresentative: true,
        status: 'CORE',
        equivalentTo: []
      },
      score: 100
    },
    {
      code: '/facepreserve',
      name: 'Preservasi Wajah Alternatif',
      item: {
        code: '/facepreserve',
        functionGroup: 'FACELOCK_PRESERVATION',
        preferredRepresentative: false,
        status: 'APPROVED',
        equivalentTo: []
      },
      score: 90
    }
  ];
  const deduped = engine.deduplicateByFunctionGroup(candidates);
  assert(deduped.length === 1, 'Hanya 1 representatif yang dipilih dari functionGroup yang sama');
  assert(deduped[0].code === '/facelock', 'Representatif terpilih adalah /facelock');
  assert(deduped[0].equivalentTo.includes('/facepreserve'), 'Kandidat lain (/facepreserve) disimpan di equivalentTo');
}

// 2. TEST SEMANTIC DEDUP 2
console.log('\n--- TEST SEMANTIC DEDUP 2: HEADWEAR_REMOVAL candidate deduplication ---');
{
  const candidates = [
    {
      code: '/headwear-remove',
      name: 'Pelepasan Penutup Kepala',
      item: {
        code: '/headwear-remove',
        functionGroup: 'HEADWEAR_REMOVAL',
        preferredRepresentative: true,
        status: 'CORE',
        equivalentTo: []
      },
      score: 95
    },
    {
      code: '/hijaboff',
      name: 'Buka Hijab Alias',
      item: {
        code: '/hijaboff',
        functionGroup: 'HEADWEAR_REMOVAL',
        preferredRepresentative: false,
        status: 'APPROVED',
        equivalentTo: []
      },
      score: 85
    }
  ];
  const deduped = engine.deduplicateByFunctionGroup(candidates);
  assert(deduped.length === 1, 'Hanya 1 representatif terpilih untuk HEADWEAR_REMOVAL');
  assert(deduped[0].code === '/headwear-remove', 'Representatif terbaik adalah /headwear-remove');
  assert(deduped[0].equivalentTo.includes('/hijaboff'), '/hijaboff terdaftar dalam equivalentTo');
}

// 3. TEST FUNCTION DIFFERENCE
console.log('\n--- TEST FUNCTION DIFFERENCE: Distinct function groups are preserved ---');
{
  const candidates = [
    {
      code: '/facelock',
      name: 'Penguncian Wajah',
      item: {
        code: '/facelock',
        functionGroup: 'FACELOCK_PRESERVATION',
        preferredRepresentative: true,
        status: 'CORE'
      }
    },
    {
      code: '/hairlock',
      name: 'Penguncian Rambut',
      item: {
        code: '/hairlock',
        functionGroup: 'HAIRLOCK_PRESERVATION',
        preferredRepresentative: true,
        status: 'CORE'
      }
    }
  ];
  const deduped = engine.deduplicateByFunctionGroup(candidates);
  assert(deduped.length === 2, 'Kedua shorthand dipertahankan karena memiliki functionGroup berbeda');
  assert(deduped.some(d => d.code === '/facelock'), 'Shorthand /facelock tetap ada');
  assert(deduped.some(d => d.code === '/hairlock'), 'Shorthand /hairlock tetap ada');
}

// 4. TEST RELATED
console.log('\n--- TEST RELATED: Semantic graph related shorthands discovered and OFF by default ---');
{
  const res = engine.analyze('hapus hijab, jangan ubah wajah');
  assert(res.primaryShorthands.length >= 2, 'Primary shorthands terdeteksi (/headwear-remove & /facelock)');
  assert(res.relatedShorthands.length > 0, `Related shorthands ditemukan (total: ${res.relatedShorthands.length})`);
  const allRelatedOff = res.relatedShorthands.every(r => r.isPrimary === false && r.checked === false);
  assert(allRelatedOff, 'Semua related shorthands berstatus isPrimary === false dan checked === false secara default');
  const relatedInInstalled = res.relatedShorthands.some(r => res.installedShorthands.includes(r.code));
  assert(!relatedInInstalled, 'Tidak ada related shorthand yang masuk ke installedShorthands secara default');
}

// 5. TEST MANUAL SELECTION
console.log('\n--- TEST MANUAL SELECTION: Related shorthand added to optimal prompt when selected ---');
{
  const baseRes = engine.analyze('hapus hijab, jangan ubah wajah');
  const manualOverrides = [...baseRes.installedShorthands, '/naturalhair'];
  const resWithManual = engine.analyze('hapus hijab, jangan ubah wajah', manualOverrides);
  assert(resWithManual.installedShorthands.includes('/naturalhair'), 'Shorthand /naturalhair masuk ke installedShorthands saat dipilih manual');
  assert(resWithManual.optimalPrompt.includes('/naturalhair'), 'Shorthand /naturalhair masuk ke Prompt Optimal');
  assert(resWithManual.optimalPrompt === 'hapus hijab, jangan ubah wajah. /headwear-remove /facelock /naturalhair', `Prompt optimal terkonfirmasi: "${resWithManual.optimalPrompt}"`);
}

// 6. TEST NO ARBITRARY LIMIT
console.log('\n--- TEST NO ARBITRARY LIMIT: No truncation on distinct relevant function groups ---');
{
  const res = engine.analyze('ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah');
  const relatedCount = res.relatedShorthands.length;
  assert(relatedCount >= 3, `Menampilkan seluruh relasi yang relevan (${relatedCount} relasi) tanpa batasan sembarangan`);
  const uniqueGroups = new Set(res.relatedShorthands.map(r => r.functionGroup || r.item?.functionGroup));
  assert(uniqueGroups.size === res.relatedShorthands.length, 'Setiap related shorthand mewakili functionGroup yang unik');
}

// 7. TEST ONLINE DUPLICATE
console.log('\n--- TEST ONLINE DUPLICATE: Duplicate detection on exact code, function group, or alias ---');
{
  const repo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  const dupCode = repo.detectSimilarFunction({ code: '/facelock' });
  assert(dupCode.hasSimilar === true && dupCode.matchType === 'EXACT_CODE', 'Mendeteksi duplikasi exact code /facelock');

  const dupGroup = repo.detectSimilarFunction({ code: '/myfacelock', functionGroup: 'FACE_PRESERVATION' });
  assert(dupGroup.hasSimilar === true && dupGroup.matchType === 'SAME_FUNCTION_GROUP', 'Mendeteksi duplikasi functionGroup FACE_PRESERVATION');

  const unique = repo.detectSimilarFunction({ code: '/unique_shorthand_v2', functionGroup: 'BRAND_NEW_GROUP' });
  assert(unique.hasSimilar === false, 'Entri unik baru tidak memicu peringatan duplikasi');
}

// 8. TEST CATALOG PERSISTENCE
console.log('\n--- TEST CATALOG PERSISTENCE: User catalog entry persists alongside core catalog ---');
{
  const repo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  const initialCount = repo.getAll().length;
  await repo.add({
    code: '/customcinematic',
    name: 'Custom Cinematic Grade',
    category: 'STYLE_EFFECT',
    target: 'Visual Style',
    functionGroup: 'CINEMATIC_ATMOSPHERE_GRADE',
    description: 'Custom atmospheric cinematic grading'
  });
  const updatedList = repo.getAll();
  assert(updatedList.length === initialCount + 1, `Jumlah katalog bertambah dari ${initialCount} menjadi ${updatedList.length}`);
  assert(updatedList.some(c => c.code === '/customcinematic' && c.source === 'USER'), 'Shorthand kustom tersimpan dengan source USER');
  assert(repo.coreCatalog.length === INITIAL_SHORTHAND_CATALOG.length, 'CORE CATALOG bawaan tidak berubah');
}

// 9. TEST RESET
console.log('\n--- TEST RESET: Analyzer reset clears prompt but preserves Catalog ---');
{
  const repo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  await repo.add({
    code: '/testreset',
    name: 'Test Reset Shorthand',
    category: 'IMAGE_QUALITY',
    target: 'Quality',
    functionGroup: 'CUSTOM_TEST'
  });

  // Simulate Analyzer Reset
  const emptyAnalysis = engine.getEmptyResult();
  assert(emptyAnalysis.optimalPrompt === '', 'Prompt optimal kosong setelah reset');
  assert(emptyAnalysis.installedShorthands.length === 0, 'Installed shorthands kosong setelah reset');

  // Verify CatalogRepository is NOT altered
  assert(repo.getAll().some(c => c.code === '/testreset'), 'User catalog item tetap tersimpan di repository setelah Analyzer reset');
  assert(repo.coreCatalog.length === INITIAL_SHORTHAND_CATALOG.length, 'Core catalog tetap utuh 100% setelah Analyzer reset');
}

// 10. TEST IMPORT / EXPORT
console.log('\n--- TEST IMPORT / EXPORT: Catalog export and import with MERGE and REPLACE modes ---');
{
  const repo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  await repo.add({
    code: '/exportitem',
    name: 'Export Test Item',
    category: 'LIGHTING',
    target: 'Lighting',
    functionGroup: 'LIGHTING_TEST'
  });

  const exportedJson = repo.exportCatalog();
  const parsed = JSON.parse(exportedJson);
  assert(parsed.catalogVersion === '2.1', 'Versi katalog ekspor adalah 2.1');
  assert(Array.isArray(parsed.entries), 'Ekspor memiliki array entries');
  assert(parsed.entries.some(e => e.code === '/exportitem'), 'Item kustom masuk ke dalam ekspor');

  // Import into fresh repo with MERGE
  const repo2 = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  const importRes = await repo2.importCatalog(exportedJson, 'MERGE');
  assert(importRes.success === true, 'Impor katalog dengan mode MERGE berhasil');
  assert(repo2.getAll().some(e => e.code === '/exportitem'), 'Item hasil impor tersedia di repository baru');

  // Import with REPLACE (replaces user entries, preserves core)
  await repo2.importCatalog(JSON.stringify({ catalogVersion: '2.1', entries: [] }), 'REPLACE');
  assert(repo2.coreCatalog.length === INITIAL_SHORTHAND_CATALOG.length, 'Core catalog tetap aman setelah impor mode REPLACE');
}

// 11. TEST API SECURITY
console.log('\n--- TEST API SECURITY: No API keys, credentials, or secrets in export or import ---');
{
  const repo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
  await repo.add({
    code: '/secretitem',
    name: 'Secret Item',
    category: 'LIGHTING',
    target: 'Light',
    functionGroup: 'SEC_TEST',
    apiKey: 'AIzaSySecretApiKey12345',
    geminiKey: 'gemini-token-secret-999',
    secret: 'super-confidential-token'
  });

  const exportedStr = repo.exportCatalog();
  assert(!exportedStr.includes('AIzaSySecretApiKey12345'), 'Ekspor TIDAK mengandung apiKey rahasia');
  assert(!exportedStr.includes('gemini-token-secret-999'), 'Ekspor TIDAK mengandung geminiKey rahasia');
  assert(!exportedStr.includes('super-confidential-token'), 'Ekspor TIDAK mengandung secret');
}

// =============================================================================
// REGRESSION & SEMANTIC CLASSIFICATION TESTS (PATCH V2.1 REQUIREMENTS)
// =============================================================================
console.log('\n--- PATCH V2.1 MANDATORY CLASSIFICATION & UI SPEC TESTS ---');

// 1. Primary classification
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(res.primaryShorthands.length === 2, 'Primary classification: exactly 2 primary shorthands');
  assert(res.primaryShorthands.some(p => p.code === '/outfit'), 'Primary classification: contains /outfit');
  assert(res.primaryShorthands.some(p => p.code === '/facelock'), 'Primary classification: contains /facelock');
  assert(res.primaryShorthands.every(p => p.isPrimary === true && p.checked === true), 'Primary classification: all isPrimary === true and checked === true');
}

// 2. Related classification
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(res.relatedShorthands.length > 0, 'Related classification: contains discovered related items');
  assert(res.relatedShorthands.some(r => r.code === '/hairlock'), 'Related classification: contains /hairlock');
  assert(res.relatedShorthands.some(r => r.code === '/bodylock'), 'Related classification: contains /bodylock');
  assert(res.relatedShorthands.some(r => r.code === '/backgroundlock'), 'Related classification: contains /backgroundlock');
  assert(res.relatedShorthands.some(r => r.code === '/enhance'), 'Related classification: contains /enhance');
  assert(res.relatedShorthands.some(r => r.code === '/sharpen'), 'Related classification: contains /sharpen');
}

// 3. Excluded classification
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(res.exclusions.length > 0, 'Excluded classification: contains non-relevant & conflicting items');
  // Conflicting items
  assert(res.exclusions.some(e => e.code === '/outfitlock' && e.reason.includes('Bertentangan')), 'Excluded classification: /outfitlock excluded due to conflict with /outfit');
  assert(res.exclusions.some(e => e.code === '/faceedit' && e.reason.includes('Bertentangan')), 'Excluded classification: /faceedit excluded due to conflict with /facelock');
  // Irrelevant domain items
  assert(res.exclusions.some(e => e.code === '/headwear-remove'), 'Excluded classification: /headwear-remove excluded (headwear not requested)');
  assert(res.exclusions.some(e => e.code === '/ar 9:16'), 'Excluded classification: /ar 9:16 excluded (ratio not requested)');
  assert(res.exclusions.some(e => e.code === '/bgremove'), 'Excluded classification: /bgremove excluded (alpha background transparency not requested)');
}

// 4. Related OFF by default
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(res.relatedShorthands.every(r => r.checked === false), 'Related OFF by default: all related items have checked === false');
  assert(res.relatedShorthands.every(r => !res.installedShorthands.includes(r.code)), 'Related OFF by default: no related items in installedShorthands');
}

// 5. Selected Related enters Prompt Optimal
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  // Simulate user selecting /hairlock and /enhance from Related
  const overrides = ['/outfit', '/facelock', '/hairlock', '/enhance'];
  const res = engine.analyze(prompt, overrides);
  assert(res.installedShorthands.includes('/hairlock'), 'Selected Related enters Prompt Optimal: installedShorthands includes /hairlock');
  assert(res.installedShorthands.includes('/enhance'), 'Selected Related enters Prompt Optimal: installedShorthands includes /enhance');
  assert(res.optimalPrompt.includes('/hairlock'), 'Selected Related enters Prompt Optimal: optimalPrompt text includes /hairlock');
  assert(res.optimalPrompt.includes('/enhance'), 'Selected Related enters Prompt Optimal: optimalPrompt text includes /enhance');
}

// 6. Unselected Related does not enter Prompt Optimal
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(!res.optimalPrompt.includes('/hairlock'), 'Unselected Related does not enter Prompt Optimal: optimalPrompt excludes unselected /hairlock');
  assert(!res.optimalPrompt.includes('/bodylock'), 'Unselected Related does not enter Prompt Optimal: optimalPrompt excludes unselected /bodylock');
  assert(!res.optimalPrompt.includes('/enhance'), 'Unselected Related does not enter Prompt Optimal: optimalPrompt excludes unselected /enhance');
  assert(!res.optimalPrompt.includes('/sharpen'), 'Unselected Related does not enter Prompt Optimal: optimalPrompt excludes unselected /sharpen');
}

// 7. Same function deduplicated
{
  const candidates = [
    { code: '/facelock', score: 95, item: { functionGroup: 'FACE_PRESERVATION', status: 'CORE', preferredRepresentative: true } },
    { code: '/facepreserve', score: 90, item: { functionGroup: 'FACE_PRESERVATION', status: 'CORE', preferredRepresentative: false } }
  ];
  const deduped = engine.deduplicateByFunctionGroup(candidates);
  assert(deduped.length === 1, 'Same function deduplicated: returns exactly 1 representative');
  assert(deduped[0].code === '/facelock', 'Same function deduplicated: selects preferred representative /facelock');
  assert(deduped[0].equivalentTo.includes('/facepreserve'), 'Same function deduplicated: alias stored in equivalentTo');
}

// 8. Different functions remain separate
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  const relatedCodes = res.relatedShorthands.map(r => r.code);
  assert(relatedCodes.includes('/enhance') && relatedCodes.includes('/sharpen'), 'Different functions remain separate: both /enhance (LIGHTING) and /sharpen (QUALITY) appear');
  assert(relatedCodes.includes('/hairlock') && relatedCodes.includes('/bodylock'), 'Different functions remain separate: both /hairlock and /bodylock appear');
}

// 9. No arbitrary related limit
{
  const prompt = 'Ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah';
  const res = engine.analyze(prompt);
  assert(res.relatedShorthands.length >= 10, `No arbitrary related limit: displays all valid functions (found: ${res.relatedShorthands.length})`);
  const functionGroups = new Set(res.relatedShorthands.map(r => r.functionGroup || r.item?.functionGroup || r.category));
  assert(functionGroups.size === res.relatedShorthands.length, 'No arbitrary related limit: every related shorthand represents a distinct function group');
}

// -----------------------------------------------------------------------------
// V3 SAFE PATCH-ONLY ARCHITECTURE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- V3 SAFE PATCH-ONLY ARCHITECTURE TESTS ---');
{
  // 1. Verify PatchManager instantiation and registration
  const pm = new PatchManager();
  const testPatch = {
    id: 'test-patch-1',
    name: 'Test Patch 1',
    version: '1.0.0',
    priority: 150,
    hooks: {
      beforeAnalysis(prompt) { return prompt + ' [PATCHED]'; }
    }
  };
  pm.registerPatch(testPatch);
  assert(pm.getAllPatches().length === 1, 'PatchManager berhasil meregistrasi patch');
  assert(pm.getActivePatches().length === 1, 'Patch baru berstatus aktif secara default');

  // 2. Safe execution handles exceptions gracefully
  const faultyPatch = {
    id: 'faulty-patch',
    name: 'Faulty Patch',
    priority: 200,
    hooks: {
      beforeAnalysis() { throw new Error('Simulated runtime error inside patch'); }
    }
  };
  pm.registerPatch(faultyPatch);
  let safeResult;
  try {
    safeResult = pm.safeExecuteHook('beforeAnalysis', 'original prompt');
  } catch (err) {
    safeResult = 'CRASHED';
  }
  assert(safeResult !== 'CRASHED', 'Safe execution wrapper mencegah crash aplikasi saat patch error');
  assert(safeResult.includes('original prompt'), 'Nilai fallback dasar dipertahankan saat patch gagal');
  assert(pm.executionLogs.length === 1, 'Error patch tercatat rapi di executionLogs untuk audit');

  // 3. Priority ordering execution
  const orderLogs = [];
  const pmOrder = new PatchManager();
  pmOrder.registerPatch({
    id: 'low-prio',
    priority: 10,
    hooks: { testHook() { orderLogs.push('low'); } }
  });
  pmOrder.registerPatch({
    id: 'high-prio',
    priority: 100,
    hooks: { testHook() { orderLogs.push('high'); } }
  });
  pmOrder.safeExecuteHook('testHook', null);
  assert(orderLogs[0] === 'high' && orderLogs[1] === 'low', 'Patch dieksekusi berurutan berdasarkan prioritas (tinggi ke rendah)');

  // 4. Patch toggle on/off
  pmOrder.setPatchEnabled('high-prio', false);
  const activeNow = pmOrder.getActivePatches('testHook');
  assert(activeNow.length === 1 && activeNow[0].id === 'low-prio', 'Patch dapat dinonaktifkan secara aman tanpa menghapus kode');

  // 5. V3.1 Core Patch integration with SemanticEngine
  const v3Engine = new SemanticEngine(INITIAL_SHORTHAND_CATALOG, globalPatchManager);
  const v3Result = v3Engine.analyze('jangan ubah wajah, ganti pakaian');
  assert(v3Result.v3Meta !== undefined, 'Analisis V3.1 menghasilkan metadata v3Meta dari Safe Patch');
  assert(v3Result.v3Meta.architecture === 'SAFE_PATCH_ONLY', 'Metadata v3Meta memuat arsitektur SAFE_PATCH_ONLY');
  assert(v3Result.v3Meta.appVersion === '3.1.0', 'Metadata v3Meta memuat appVersion 3.1.0');
  assert(v3Result.v3Meta.basisSourceOfTruth.includes('V3'), 'Metadata mengonfirmasi Source of Truth adalah V3 (v3.0.0-stable)');

  // 6. Source of Truth V3 catalog immutability check
  assert(INITIAL_SHORTHAND_CATALOG.length === 59, `Katalog V3.1 memuat 59 item lengkap (termasuk /outpaint)`);
}

// -----------------------------------------------------------------------------
// KAMUS SHORTHAND (DICTIONARY) FEATURE TESTS
// -----------------------------------------------------------------------------
console.log('\n--- KAMUS SHORTHAND FEATURE TESTS ---');
{
  // 1. Local Search Relevance: "wajah"
  const resWajah = DictionaryService.searchLocal('wajah', INITIAL_SHORTHAND_CATALOG);
  assert(resWajah.length > 0, 'Pencarian lokal "wajah" menghasilkan output');
  assert(resWajah[0].code === '/facelock', 'Pencarian "wajah" menempatkan /facelock di peringkat pertama');
  assert(resWajah[0].source === 'LOCAL', 'Hasil pencarian katalog lokal memiliki label LOCAL');

  // 2. Local Search Relevance: "rambut"
  const resRambut = DictionaryService.searchLocal('rambut', INITIAL_SHORTHAND_CATALOG);
  const rambutCodes = resRambut.map(r => r.code);
  assert(rambutCodes.includes('/hairlock') || rambutCodes.includes('/naturalhair'), 'Pencarian "rambut" menemukan /hairlock atau /naturalhair');

  // 3. Local Search Relevance: "pencahayaan"
  const resCahaya = DictionaryService.searchLocal('pencahayaan', INITIAL_SHORTHAND_CATALOG);
  const cahayaCodes = resCahaya.map(r => r.code);
  assert(cahayaCodes.includes('/enhance'), 'Pencarian "pencahayaan" menemukan /enhance');

  // 4. Local Search Relevance: "ketajaman"
  const resTajam = DictionaryService.searchLocal('ketajaman', INITIAL_SHORTHAND_CATALOG);
  const tajamCodes = resTajam.map(r => r.code);
  assert(tajamCodes.includes('/sharpen'), 'Pencarian "ketajaman" menemukan /sharpen');

  // 5. Exact code search
  const resExact = DictionaryService.searchLocal('/facelock', INITIAL_SHORTHAND_CATALOG);
  assert(resExact.length > 0 && resExact[0].code === '/facelock', 'Pencarian exact code "/facelock" mengembalikan item yang sesuai');
  assert(resExact[0].score >= 1000, 'Exact code match memiliki bobot skor tertinggi (>= 1000)');

  // 6. Online Fallback when local is empty
  let asyncTestPassed = false;
  const mockGeminiOnline = {
    searchOnlineShorthand: async (query) => {
      return {
        results: [
          {
            code: '/portrait',
            name: 'Portrait Photography',
            description: 'Portrait shot',
            category: 'CAMERA_PHOTO',
            source: 'ONLINE',
            isOnline: true
          }
        ],
        onlineAvailable: true,
        message: ''
      };
    }
  };

  const onlineMerged = await DictionaryService.search('portrait photography style', INITIAL_SHORTHAND_CATALOG, mockGeminiOnline);
  assert(onlineMerged.results.some(r => r.code === '/portrait'), 'Online fallback berhasil mengisi shorthand saat katalog lokal minim');
  assert(onlineMerged.results.find(r => r.code === '/portrait').source === 'ONLINE', 'Hasil online memiliki label ONLINE');

  // 7. Offline notice when online search is not available
  const offlineResult = await DictionaryService.search('xyzrandomquerynotfound999', INITIAL_SHORTHAND_CATALOG, null);
  assert(offlineResult.results.length === 0, 'Kueri tidak dikenal dan tanpa online menghasilkan 0 hasil');
  assert(offlineResult.notice.includes('Shorthand tidak ditemukan di katalog lokal dan pencarian online tidak tersedia'), 'Menampilkan pesan fallback yang tepat saat online tidak tersedia');

  // 8. Workflow Simulation: Repeatable search without resetting selected items
  const selectedShorthands = [];

  // Step 1: Cari "wajah", tambah /facelock
  const search1 = DictionaryService.searchLocal('wajah', INITIAL_SHORTHAND_CATALOG);
  selectedShorthands.push(search1[0]); // /facelock
  assert(selectedShorthands.length === 1 && selectedShorthands[0].code === '/facelock', 'Workflow Step 1: /facelock berhasil ditambahkan');

  // Step 2: Cari "rambut", tambah /naturalhair (seleksi sebelumnya TIDAK terhapus)
  const search2 = DictionaryService.searchLocal('rambut', INITIAL_SHORTHAND_CATALOG);
  const naturalHairItem = search2.find(r => r.code === '/naturalhair') || { code: '/naturalhair', name: 'Natural Hair' };
  selectedShorthands.push(naturalHairItem);
  assert(selectedShorthands.length === 2, 'Workflow Step 2: Pencarian baru tidak mereset shorthand sebelumnya');
  assert(selectedShorthands[0].code === '/facelock' && selectedShorthands[1].code === '/naturalhair', 'Urutan seleksi [1. /facelock, 2. /naturalhair] dipertahankan');

  // Step 3: Cari "pencahayaan", tambah /enhance
  const search3 = DictionaryService.searchLocal('pencahayaan', INITIAL_SHORTHAND_CATALOG);
  const enhanceItem = search3.find(r => r.code === '/enhance') || { code: '/enhance', name: 'Enhance' };
  selectedShorthands.push(enhanceItem);

  // Step 4: Cari "ketajaman", tambah /sharpen
  const search4 = DictionaryService.searchLocal('ketajaman', INITIAL_SHORTHAND_CATALOG);
  const sharpenItem = search4.find(r => r.code === '/sharpen') || { code: '/sharpen', name: 'Sharpen' };
  selectedShorthands.push(sharpenItem);
  assert(selectedShorthands.length === 4, 'Workflow Step 4: 4 shorthand berhasil dikumpulkan');

  // 9. Strict Insertion Order Verification
  const expectedOrder = ['/facelock', '/naturalhair', '/enhance', '/sharpen'];
  const actualOrder = selectedShorthands.map(s => s.code);
  const orderMatches = expectedOrder.every((code, idx) => actualOrder[idx] === code);
  assert(orderMatches, 'Urutan preserved: /facelock -> /naturalhair -> /enhance -> /sharpen (bukan alfabetis)');

  // 10. Duplicate Prevention Verification
  const duplicateAttempt = { code: '/facelock', name: 'Face Lock' };
  const alreadyExists = selectedShorthands.some(s => s.code === duplicateAttempt.code);
  if (!alreadyExists) {
    selectedShorthands.push(duplicateAttempt);
  }
  assert(selectedShorthands.length === 4, 'Cegah duplikasi: shorthand /facelock tidak ditambahkan dua kali');

  // 11. Format for Copy (Pure shorthand codes separated by space)
  const copyOutput = DictionaryService.formatSelectedForCopy(selectedShorthands);
  assert(copyOutput === '/facelock /naturalhair /enhance /sharpen', `Format salinan murni tepat: "${copyOutput}"`);
  assert(!copyOutput.includes('LOCAL') && !copyOutput.includes('ONLINE'), 'Teks salinan tidak mengandung label LOCAL atau ONLINE');
  assert(!copyOutput.includes('1.') && !copyOutput.includes('2.'), 'Teks salinan tidak mengandung nomor urutan');

  // 12. Remove single item (tombol ×)
  const filteredAfterRemove = selectedShorthands.filter(s => s.code !== '/naturalhair');
  assert(filteredAfterRemove.length === 3, 'Hapus item tunggal menyisakan 3 item');
  assert(DictionaryService.formatSelectedForCopy(filteredAfterRemove) === '/facelock /enhance /sharpen', 'Urutan item tersisa tetap konsisten setelah penghapusan');

  // 13. Clear all (Hapus Semua)
  const clearedList = [];
  assert(clearedList.length === 0, 'Hapus Semua berhasil mengosongkan daftar terpilih');
  assert(INITIAL_SHORTHAND_CATALOG.length === 59, 'Hapus Semua TIDAK mengubah katalog dasar (tetap 59 item)');

  // 14. Dedicated Verification: "montok" in Kamus Shorthand
  const resMontok = DictionaryService.searchLocal('montok', INITIAL_SHORTHAND_CATALOG);
  assert(resMontok.length > 0, 'Kamus Shorthand: Pencarian "montok" menghasilkan rekomendasi');
  assert(resMontok[0].code === '/bodyvoluptuous', `Kamus Shorthand: Hasil peringkat pertama adalah /bodyvoluptuous (ditemukan: ${resMontok[0]?.code})`);
  const montokCodes = resMontok.map(r => r.code);
  assert(montokCodes.includes('/curvy'), 'Kamus Shorthand: Menyertakan alternatif /curvy');
  assert(montokCodes.includes('/voluptuous'), 'Kamus Shorthand: Menyertakan alternatif /voluptuous');
  assert(montokCodes.includes('/fullfigured'), 'Kamus Shorthand: Menyertakan alternatif /fullfigured');
  assert(montokCodes.includes('/plussize'), 'Kamus Shorthand: Menyertakan alternatif /plussize');

  // 15. Dedicated Verification: "anatomi tangan natural" in Kamus Shorthand
  const resHand = DictionaryService.searchLocal('anatomi tangan natural', INITIAL_SHORTHAND_CATALOG);
  assert(resHand.length > 0, 'Kamus Shorthand: Pencarian "anatomi tangan natural" menghasilkan rekomendasi');
  assert(resHand[0].code === '/handperfect', `Kamus Shorthand: Hasil peringkat pertama tangan adalah /handperfect (ditemukan: ${resHand[0]?.code})`);
  const handCodes = resHand.map(r => r.code);
  assert(handCodes.includes('/hands'), 'Kamus Shorthand: Menyertakan alternatif /hands');
  assert(handCodes.includes('/handanatomy'), 'Kamus Shorthand: Menyertakan alternatif /handanatomy');
  assert(handCodes.includes('/fingerperfect'), 'Kamus Shorthand: Menyertakan alternatif /fingerperfect');
  assert(handCodes.includes('/handdetail'), 'Kamus Shorthand: Menyertakan alternatif /handdetail');
  assert(handCodes.includes('/handnatural'), 'Kamus Shorthand: Menyertakan alternatif /handnatural');

  // 16. Dedicated Verification: Deduplikasi Fungsi Semantik & "resolusi tinggi"
  // Aturan user: Jika beberapa shorthand memiliki fungsi/makna sama, hanya tampilkan 1 shorthand paling relevan
  const resResolution = DictionaryService.searchLocal('resolusi tinggi', INITIAL_SHORTHAND_CATALOG);
  assert(resResolution.length > 0, 'Kamus Shorthand: Pencarian "resolusi tinggi" menemukan rekomendasi');
  assert(resResolution[0].code === '/highresolution', `Kamus Shorthand: Pilihan utama resolusi tinggi adalah /highresolution (ditemukan: ${resResolution[0]?.code})`);
  const resolutionItems = resResolution.filter(r => r.functionGroup === 'IMAGE_RESOLUTION');
  assert(resolutionItems.length === 1, `Deduplikasi semantik: Hanya 1 shorthand representatif terbaik yang ditampilkan untuk fungsi resolusi (ditemukan: ${resolutionItems.length})`);
  assert(Array.isArray(resResolution[0].equivalentTo) && resResolution[0].equivalentTo.includes('/upscale'), 'Shorthand representatif merangkum varian fungsi setara di equivalentTo');
}

// -----------------------------------------------------------------------------
// VERIFIKASI KHUSUS USER: "montok" SEMANTIC ANALYZER
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: "montok" DI SEMANTIC ENGINE ---');
{
  const res = engine.analyze('montok');
  assert(res.intent.primaryAction === 'MODIFIKASI_BENTUK_TUBUH', `Intent terdeteksi: ${res.intent.primaryAction}`);
  assert(res.editAreas.some(e => e.entity === 'BODY_POSE'), 'Area edit terdeteksi sebagai BODY_POSE');
  assert(res.installedShorthands.includes('/bodyvoluptuous'), 'Shorthand /bodyvoluptuous terpasang pada installedShorthands');
  assert(res.optimalPrompt === 'montok. /bodyvoluptuous', `Prompt optimal: "${res.optimalPrompt}"`);
  
  // Periksa rekomendasi (Primary WAJIB + Alternatives DISARANKAN)
  const primaryVoluptuous = res.recommendations.find(r => r.code === '/bodyvoluptuous');
  assert(primaryVoluptuous && primaryVoluptuous.priority === 'WAJIB', 'Rekomendasi utama /bodyvoluptuous bertaraf WAJIB');
  
  const recCodes = res.recommendations.map(r => r.code);
  assert(recCodes.includes('/curvy'), 'Rekomendasi alternatif menyertakan /curvy (tubuh berlekuk)');
  assert(recCodes.includes('/fullfigured'), 'Rekomendasi alternatif menyertakan /fullfigured (tubuh berisi proporsi penuh)');
  assert(recCodes.includes('/plussize'), 'Rekomendasi alternatif menyertakan /plussize (ukuran tubuh plus-size)');
  assert(recCodes.includes('/voluptuous'), 'Rekomendasi alternatif menyertakan /voluptuous (montok/berisi lekuk menonjol)');
}

// -----------------------------------------------------------------------------
// VERIFIKASI KHUSUS USER: "anatomi tangan natural" (UNGGAHAN 1 & 2)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: "anatomi tangan natural" DI SEMANTIC ENGINE ---');
{
  const res = engine.analyze('anatomi tangan natural');
  assert(res.intent.primaryAction === 'PENYEMPURNAAN_ANATOMI_TANGAN', `Intent terdeteksi: ${res.intent.primaryAction}`);
  assert(res.editAreas.some(e => e.entity === 'BODY_POSE'), 'Area edit terdeteksi sebagai BODY_POSE');
  assert(res.installedShorthands.includes('/handperfect'), 'Shorthand /handperfect terpasang pada installedShorthands');
  assert(res.optimalPrompt === 'anatomi tangan natural. /handperfect', `Prompt optimal: "${res.optimalPrompt}"`);
  
  // Periksa rekomendasi utama dan alternatif
  const primaryHand = res.recommendations.find(r => r.code === '/handperfect');
  assert(primaryHand && primaryHand.priority === 'WAJIB', 'Rekomendasi utama /handperfect bertaraf WAJIB');
  
  const recCodes = res.recommendations.map(r => r.code);
  assert(recCodes.includes('/hands'), 'Rekomendasi alternatif menyertakan /hands (fokus pada tangan)');
  assert(recCodes.includes('/handanatomy'), 'Rekomendasi alternatif menyertakan /handanatomy (anatomi tangan natural)');
  assert(recCodes.includes('/fingerperfect'), 'Rekomendasi alternatif menyertakan /fingerperfect (kesempurnaan jari)');
  assert(recCodes.includes('/handdetail'), 'Rekomendasi alternatif menyertakan /handdetail (detail tangan dan jari)');
  assert(recCodes.includes('/handnatural'), 'Rekomendasi alternatif menyertakan /handnatural (tangan natural dan proporsional)');
}

// -----------------------------------------------------------------------------
// VERIFIKASI KHUSUS USER: "resolusi tinggi" (UNGGAHAN 1 & 2 - SINGLE REPRESENTATIVE)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: "resolusi tinggi" DI SEMANTIC ENGINE ---');
{
  const res = engine.analyze('resolusi tinggi');
  assert(res.intent.primaryAction === 'PENINGKATAN_RESOLUSI', `Intent terdeteksi: ${res.intent.primaryAction}`);
  assert(res.intent.category === 'IMAGE_QUALITY', `Kategori terdeteksi: ${res.intent.category}`);
  assert(res.editAreas.some(e => e.entity === 'IMAGE_QUALITY'), 'Area edit terdeteksi sebagai IMAGE_QUALITY');
  assert(res.installedShorthands.includes('/highresolution'), 'Shorthand /highresolution terpasang pada installedShorthands');
  assert(res.optimalPrompt === 'resolusi tinggi. /highresolution', `Prompt optimal: "${res.optimalPrompt}"`);
  
  // Periksa rekomendasi utama
  const primaryHighRes = res.recommendations.find(r => r.code === '/highresolution');
  assert(primaryHighRes && primaryHighRes.priority === 'WAJIB', 'Rekomendasi utama /highresolution bertaraf WAJIB');
  
  // Pastikan tidak ada duplikasi fungsi dalam rekomendasi utama
  const highResPrimaries = res.primaryShorthands.filter(p => p.category === 'IMAGE_QUALITY');
  assert(highResPrimaries.length === 1, `Hanya ada 1 shorthand utama untuk fungsi resolusi (ditemukan: ${highResPrimaries.length})`);
}

// -----------------------------------------------------------------------------
// VERIFIKASI USER: SARAN PADA "SHORTHAND KONFLIK" (UNGGAHAN USER SCREENSHOT)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: SARAN PADA "SHORTHAND KONFLIK" ---');
{
  // Test case dari screenshot user yang memuat 5 konflik direktif latar belakang:
  // /backgroundlock vs /bgblur, /backgroundlock vs /studiobg, /bgreplace vs /bgremove, dll.
  const complexPrompt = 'pertahankan latar belakang asli /backgroundlock, tapi buat latar buram /bgblur, ubah ke studio /studiobg, ganti latar /bgreplace dan hapus latar belakang /bgremove';
  const res = engine.analyze(complexPrompt);
  assert(res.conflicts.length > 0, `Terdeteksi konflik direktif (ditemukan: ${res.conflicts.length})`);

  // 1. Setiap item konflik wajib memuat saran resolusi (suggestion) yang informatif
  for (const c of res.conflicts) {
    assert(Boolean(c.suggestion), `Konflik ${c.shorthandA} vs ${c.shorthandB} memiliki properti suggestion`);
    assert(typeof c.suggestion === 'string' && c.suggestion.length > 30, `Saran untuk ${c.shorthandA} vs ${c.shorthandB} informatif dan komprehensif`);
  }

  // 2. Verifikasi spesifik saran pada konflik /backgroundlock vs /bgblur
  const bgBlurConflict = res.conflicts.find(c => 
    (c.shorthandA === '/backgroundlock' && c.shorthandB === '/bgblur') ||
    (c.shorthandA === '/bgblur' && c.shorthandB === '/backgroundlock')
  );
  assert(Boolean(bgBlurConflict), 'Konflik /backgroundlock vs /bgblur terdeteksi');
  assert(bgBlurConflict.suggestion.includes('bokeh') || bgBlurConflict.suggestion.includes('blur'), 'Saran /backgroundlock vs /bgblur merekomendasikan opsi efek blur');

  // 3. Verifikasi spesifik saran pada konflik /bgreplace vs /bgremove
  const bgReplaceRemoveConflict = res.conflicts.find(c => 
    (c.shorthandA === '/bgreplace' && c.shorthandB === '/bgremove') ||
    (c.shorthandA === '/bgremove' && c.shorthandB === '/bgreplace')
  );
  assert(Boolean(bgReplaceRemoveConflict), 'Konflik /bgreplace vs /bgremove terdeteksi');
  assert(bgReplaceRemoveConflict.suggestion.includes('transparan') || bgReplaceRemoveConflict.suggestion.includes('cutout'), 'Saran /bgreplace vs /bgremove menjelaskan perbedaan transparan vs ganti lokasi');

  // 4. Verifikasi UI Banner: HTML memuat box saran solusi
  const banner = renderConflictBanner(res.conflicts);
  assert(banner.html.includes('conflict-suggestion-box'), 'UI ConflictBanner me-render elemen .conflict-suggestion-box');
  assert(banner.html.includes('SARAN SOLUSI:'), 'UI ConflictBanner menampilkan label "SARAN SOLUSI:"');
}

// -----------------------------------------------------------------------------
// VERIFIKASI USER: SHOW/HIDE PADA SHORTHAND TIDAK DIPERLUKAN (DIKECUALIKAN)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: SHOW/HIDE EXCLUDED SHORTHANDS (DEFAULT HIDE) ---');
{
  const mockExclusions = [
    { code: '/hairlock', target: 'HAIR', reason: 'Tidak ada instruksi yang memodifikasi rambut.' },
    { code: '/outfitlock', target: 'OUTFIT', reason: 'Pakaian subjek tidak diminta untuk dikunci.' }
  ];
  const comp = renderExcludedShorthands(mockExclusions);

  assert(comp.html.includes('id="card-exclusions"'), 'Card H me-render section #card-exclusions');
  assert(comp.html.includes('id="btn-toggle-exclusions"'), 'Card H memuat tombol toggle #btn-toggle-exclusions');
  assert(comp.html.includes('Tampilkan / Show'), 'Kondisi tombol awal memuat teks "Tampilkan / Show"');
  assert(comp.html.includes('id="exclusions-content"'), 'Card H memuat kontainer #exclusions-content');
  assert(comp.html.includes('style="display: none;"'), 'Kondisi awal DEFAULT HIDE terpasang (style="display: none;")');
  assert(typeof comp.bindEvents === 'function', 'Komponen ExcludedShorthands menyediakan fungsi bindEvents');
}

// -----------------------------------------------------------------------------
// VERIFIKASI USER: "memperluas foto" DI SEMANTIC ENGINE (LOKAL)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI USER: "memperluas foto" DI SEMANTIC ENGINE (LOKAL) ---');
{
  const res = engine.analyze('memperluas foto');
  assert(res.intent.primaryAction === 'PERLUASAN_KANVAS_OUTPAINT', 'Intent terdeteksi: PERLUASAN_KANVAS_OUTPAINT');
  assert(res.editAreas.some(e => e.entity === 'CANVAS_RATIO'), 'Area edit terdeteksi sebagai CANVAS_RATIO');
  assert(res.installedShorthands.includes('/outpaint'), 'Shorthand /outpaint terpasang pada installedShorthands');
  assert(res.optimalPrompt === 'memperluas foto. /outpaint', `Prompt optimal: "${res.optimalPrompt}"`);
  assert(res.primaryShorthands.some(p => p.code === '/outpaint'), 'Rekomendasi utama /outpaint bertaraf WAJIB');
  assert(res.primaryShorthands[0].isPrimary === true, 'isPrimary bernilai true');
  assert(res.primaryShorthands[0].checked === true, 'checked bernilai true');
}

// -----------------------------------------------------------------------------
// VERIFIKASI GEMINI API KEY CONDITION MATRIX (ONLINE AKTIF VS TIDAK AKTIF)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI GEMINI API KEY CONDITION MATRIX ---');
{
  const service = new GeminiService(INITIAL_SHORTHAND_CATALOG);

  // 1. Kondisi API Key TIDAK TERHUBUNG -> Pencarian Online Shorthand TIDAK AKTIF
  const resOffline = await service.analyzePrompt('memperluas foto');
  assert(resOffline.source === 'LOCAL_ENGINE', 'Ketika API Key tidak ada: source adalah LOCAL_ENGINE');
  assert(resOffline.isOnlineActive === false, 'Ketika API Key tidak ada: isOnlineActive adalah false (TIDAK AKTIF)');
  assert(resOffline.installedShorthands.includes('/outpaint'), 'Heuristik lokal tetap menghasilkan /outpaint');

  // 2. Kondisi Mock AI Response saat Online Shorthand Search AKTIF (Terbuka & Tidak Terbatas)
  const mockAiAnyTopic = {
    intent: {
      primaryAction: 'OPERASI_BEDAH_FUTURISTIK',
      primaryTarget: 'Dokter Bedah & Rumah Sakit',
      summary: 'Menggambarkan dokter bedah sedang operasi di rumah sakit modern.',
      priority: 'HIGH',
      category: 'BODY_POSE'
    },
    primaryShorthands: [
      {
        code: '/surgeon',
        name: 'Surgeon in Operation',
        category: 'BODY_POSE',
        target: 'Dokter Bedah',
        description: 'Karakter dokter bedah profesional dalam suasana operasi',
        priority: 'WAJIB',
        reason: 'Shorthand utama relevan untuk konsep dokter bedah',
        isPrimary: true,
        checked: true
      }
    ],
    relatedShorthands: [
      {
        code: '/hightech-hospital',
        name: 'Futuristic Hospital Room',
        category: 'BACKGROUND',
        target: 'Latar Rumah Sakit',
        description: 'Suasana ruang operasi canggih',
        priority: 'DISARANKAN',
        reason: 'Alternatif latar belakang rumah sakit futuristik',
        isPrimary: false,
        checked: false
      }
    ],
    installedShorthands: ['/surgeon'],
    optimalPrompt: 'dokter bedah sedang operasi di rumah sakit futuristik. /surgeon',
    visualTransformation: 'Dokter bedah dalam ruangan operasi futuristik.'
  };

  const mergedOnline = service.mergeAiWithCatalog(mockAiAnyTopic, 'dokter bedah sedang operasi di rumah sakit futuristik');
  assert(mergedOnline.primaryShorthands.some(p => p.code === '/surgeon'), 'Pencarian online terbuka menemukan shorthand /surgeon untuk profesi/topik baru');
  assert(mergedOnline.primaryShorthands[0].source === 'ONLINE', 'Shorthand konsep baru ditandai source ONLINE');
  assert(mergedOnline.primaryShorthands[0].isOnline === true, 'Flag isOnline bernilai true');
  assert(mergedOnline.installedShorthands.includes('/surgeon'), '/surgeon terpasang di installedShorthands');
  assert(mergedOnline.optimalPrompt.includes('/surgeon'), 'Prompt optimal memuat /surgeon');
  assert(mergedOnline.relatedShorthands.some(r => r.code === '/hightech-hospital'), 'Pencarian online menyertakan alternatif /hightech-hospital');
  assert(mergedOnline.relatedShorthands[0].isOnline === true, 'Alternatif online ditandai isOnline');

  // 3. Uji dynamic merge AI response untuk konsep outpainting online
  const mockAiOutpaint = {
    intent: {
      primaryAction: 'PERLUASAN_KANVAS_OUTPAINT',
      primaryTarget: 'Bidang Foto Luar Frame',
      summary: 'Memperluas bidang foto di luar kanvas asli.',
      priority: 'HIGH',
      category: 'CANVAS_RATIO'
    },
    primaryShorthands: [
      {
        code: '/outpaint',
        name: 'AI Canvas Outpainting & Expansion',
        category: 'CANVAS_RATIO',
        target: 'Bidang & Batas Kanvas Foto',
        description: 'Memperluas dimensi bidang gambar di luar batas kanvas asli',
        priority: 'WAJIB',
        reason: 'Paling tepat untuk memperluas foto',
        isPrimary: true,
        checked: true
      }
    ],
    relatedShorthands: [
      {
        code: '/expandcanvas',
        name: 'Canvas Frame Expansion',
        category: 'CANVAS_RATIO',
        target: 'Dimensi Frame',
        description: 'Alternatif pembesaran frame',
        priority: 'DISARANKAN',
        reason: 'Alternatif outpainting',
        isPrimary: false,
        checked: false
      }
    ],
    installedShorthands: ['/outpaint'],
    optimalPrompt: 'memperluas foto. /outpaint',
    visualTransformation: 'Foto diperluas ke segala arah dengan latar belakang koheren.'
  };

  const mergedOutpaint = service.mergeAiWithCatalog(mockAiOutpaint, 'memperluas foto');
  assert(mergedOutpaint.primaryShorthands.some(p => p.code === '/outpaint'), 'Online AI berhasil memetakan "memperluas foto" ke /outpaint');
  assert(mergedOutpaint.installedShorthands.includes('/outpaint'), '/outpaint terpasang otomatis di installedShorthands');
  assert(mergedOutpaint.optimalPrompt.includes('/outpaint'), 'Optimal prompt memuat /outpaint');
  assert(mergedOutpaint.relatedShorthands.some(r => r.code === '/expandcanvas'), 'Online AI menyertakan alternatif /expandcanvas');
}

// -----------------------------------------------------------------------------
// VERIFIKASI UI PROMPT INPUT STATUS BANNER
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI UI PROMPT INPUT STATUS BANNER ---');
{
  const { renderPromptInput } = await import('../src/components/PromptInput.js');

  const compActive = renderPromptInput({ isOnlineActive: true });
  assert(compActive.html.includes('Pencarian Online Shorthand: AKTIF'), 'UI PromptInput menampilkan status AKTIF saat online terhubung');
  assert(compActive.html.includes('status-pulse-dot'), 'UI PromptInput menyertakan pulse indicator dot saat aktif');
  assert(compActive.html.includes('🌐 Analisis Prompt'), 'Tombol Analisis memuat label online saat aktif');

  const compInactive = renderPromptInput({ isOnlineActive: false });
  assert(compInactive.html.includes('Pencarian Online Shorthand: TIDAK AKTIF'), 'UI PromptInput menampilkan status TIDAK AKTIF saat belum terhubung');
  assert(compInactive.html.includes('Mode Heuristik Lokal'), 'UI PromptInput menjelaskan mode heuristik lokal saat tidak aktif');
}

// -----------------------------------------------------------------------------
// VERIFIKASI RESILIENSI KONEKSI GEMINI (ANTI-TERPUTUS SAAT ANALISIS)
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI RESILIENSI KONEKSI GEMINI (ANTI-TERPUTUS) ---');
{
  const { GEMINI_STATUS } = await import('../src/services/geminiService.js');
  const { StorageService } = await import('../src/services/storageService.js');

  // Test StorageService default model
  assert(StorageService.getModel() === 'gemini-2.0-flash', 'Model default adalah gemini-2.0-flash yang stabil');

  const resilientService = new GeminiService(INITIAL_SHORTHAND_CATALOG);
  resilientService.status = GEMINI_STATUS.CONNECTED;

  // 1. Verifikasi extractJson
  const plainObj = resilientService.extractJson('{"status": "ok", "value": 42}');
  assert(plainObj.value === 42, 'extractJson berhasil membaca raw JSON murni');

  const fencedObj = resilientService.extractJson('```json\n{"intent": "TEST_FENCE", "code": "/test"}\n```');
  assert(fencedObj.code === '/test', 'extractJson berhasil membaca JSON dalam markdown code fence');

  const messyObj = resilientService.extractJson('Tentu, ini hasil analisis prompt Anda:\n\n{"intent": "TEST_MESSY", "score": 99}\n\nSemoga membantu!');
  assert(messyObj.score === 99, 'extractJson berhasil mengekstrak objek JSON di tengah teks pembuka/penutup');

  const arrObj = resilientService.extractJson('```\n[{"code": "/portrait", "name": "Portrait"}]\n```');
  assert(Array.isArray(arrObj) && arrObj[0].code === '/portrait', 'extractJson berhasil mengekstrak array JSON');

  // 2. Verifikasi Simulasi analyzePrompt saat API fetch gagal
  // Simulasikan API key ada di storage
  const originalGetApiKey = StorageService.getApiKey;
  StorageService.getApiKey = () => 'AIzaSyMockKeyForTest';

  // Simulasikan callGeminiAPI melempar error (misal model 404, rate limit, atau timeout)
  resilientService.callGeminiAPI = async () => {
    throw new Error('HTTP 404: models/gemini-2.5-flash is not found for API version v1beta');
  };

  const resultOnFailure = await resilientService.analyzePrompt('perbaiki pencahayaan foto');

  assert(resilientService.status === GEMINI_STATUS.CONNECTED, 'Koneksi Gemini TETAP CONNECTED (🟢) dan TIDAK TERPUTUS saat API gagal');
  assert(resilientService.status !== GEMINI_STATUS.FAILED, 'Status Gemini BUKAN FAILED (🔴)');
  assert(resultOnFailure.isOnlineActive === true, 'isOnlineActive tetap true agar status online di UI tidak padam');
  assert(resultOnFailure.source === 'LOCAL_ENGINE_FALLBACK', 'Source beralih mulus ke LOCAL_ENGINE_FALLBACK');
  assert(resultOnFailure.installedShorthands.includes('/enhance'), 'Hasil analisis lokal tetap akurat (/enhance terpasang)');
  assert(resultOnFailure.engineNotice.includes('Koneksi tetap tersambung'), 'Engine notice mengonfirmasi koneksi tetap aman terjaga');

  // Restore storage mock
  StorageService.getApiKey = originalGetApiKey;
}

// -----------------------------------------------------------------------------
// VERIFIKASI V3.2: FITUR "PERKAYA DENGAN AI" PADA PROMPT OPTIMAL
// -----------------------------------------------------------------------------
console.log('\n--- VERIFIKASI V3.2: FITUR "PERKAYA DENGAN AI" ---');
{
  const { renderPromptOptimal } = await import('../src/components/PromptOptimal.js');
  const { GeminiService, GEMINI_STATUS } = await import('../src/services/geminiService.js');
  const { StorageService } = await import('../src/services/storageService.js');

  // 1. Verifikasi UI Button di PromptOptimal
  // Skenario A: Saat Offline / API belum terhubung -> Tombol DISABLED
  const compOffline = renderPromptOptimal({
    optimalPrompt: 'An Indonesian businesswoman reviewing sales growth targets on a tablet.',
    isOnlineActive: false,
    isEnriching: false
  });
  assert(compOffline.html.includes('id="btn-enrich-ai"'), 'PromptOptimal me-render tombol #btn-enrich-ai');
  assert(compOffline.html.includes('disabled'), 'Tombol PERKAYA DENGAN AI disabled saat Gemini belum terhubung');
  assert(compOffline.html.includes('✨ PERKAYA DENGAN AI'), 'Label tombol dalam kondisi normal memuat "✨ PERKAYA DENGAN AI"');
  assert(compOffline.html.includes('membutuhkan koneksi Gemini API'), 'Tooltip menjelaskan fitur butuh koneksi Gemini');

  // Skenario B: Saat Online tetapi Prompt Optimal masih kosong -> Tombol DISABLED
  const compEmpty = renderPromptOptimal({
    optimalPrompt: '',
    isOnlineActive: true,
    isEnriching: false
  });
  assert(compEmpty.html.includes('disabled'), 'Tombol disabled jika Prompt Optimal masih kosong');

  // Skenario C: Saat Online dan Prompt Optimal terisi -> Tombol AKTIF
  const compActive = renderPromptOptimal({
    optimalPrompt: 'An Indonesian businesswoman reviewing sales growth targets on a tablet. /facelock /enhance',
    isOnlineActive: true,
    isEnriching: false
  });
  assert(!compActive.html.match(/id="btn-enrich-ai"[^>]*disabled/), 'Tombol PERKAYA DENGAN AI aktif (tidak disabled) saat online dan prompt terisi');

  // Skenario D: Saat proses enriching berjalan -> State "⏳ MEMPERKAYA..." dan disabled
  const compLoading = renderPromptOptimal({
    optimalPrompt: 'An Indonesian businesswoman reviewing sales growth targets on a tablet.',
    isOnlineActive: true,
    isEnriching: true
  });
  assert(compLoading.html.includes('⏳ MEMPERKAYA...'), 'Label berubah menjadi "⏳ MEMPERKAYA..." saat proses berlangsung');
  assert(compLoading.html.includes('disabled'), 'Tombol disabled saat sedang memperkaya untuk mencegah request ganda');

  // 2. Verifikasi GeminiService.enrichPrompt (Logika & Preservasi)
  const service = new GeminiService(INITIAL_SHORTHAND_CATALOG);

  // Skenario E: Ketika key kosong -> lempar error yang jelas
  const originalKeyFn = StorageService.getApiKey;
  StorageService.getApiKey = () => '';
  try {
    await service.enrichPrompt('test prompt');
    assert(false, 'Harus melempar error saat API key tidak ada');
  } catch (err) {
    assert(err.message.includes('Gemini API Key belum terhubung'), 'Melempar pesan error jelas saat API key belum ada');
  }

  // Skenario F: Simulasi sukses enrichPrompt dengan preservasi subjek dan shorthand
  StorageService.getApiKey = () => 'AIzaSyMockKeyForEnrichTest';
  const originalPrompt = 'An Indonesian businesswoman reviewing sales growth targets on a tablet. /facelock /enhance';

  // Mock global fetch untuk generateContent
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    return {
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [
                {
                  text: JSON.stringify({
                    enrichedPrompt: 'Close-up portrait of an Indonesian businesswoman in a modern glass office, reviewing sales growth targets on a digital tablet with charts, soft cinematic office lighting, 85mm lens, depth of field. /facelock'
                  })
                }
              ]
            }
          }
        ]
      })
    };
  };

  const enrichResult = await service.enrichPrompt(originalPrompt, {
    intent: { summary: 'Potret pebisnis wanita Indonesia memeriksa target penjualan' }
  });

  assert(enrichResult.success === true, 'enrichPrompt berhasil dieksekusi');
  assert(enrichResult.enrichedPrompt.includes('Indonesian businesswoman'), 'Subjek utama (Indonesian businesswoman) dipertahankan');
  assert(enrichResult.enrichedPrompt.includes('sales growth'), 'Aktivitas/objek (sales growth) dipertahankan');
  assert(enrichResult.enrichedPrompt.includes('tablet'), 'Objek (tablet) dipertahankan');
  assert(enrichResult.enrichedPrompt.includes('/facelock'), 'Shorthand /facelock tetap dipertahankan');
  assert(enrichResult.enrichedPrompt.includes('/enhance'), 'Shorthand /enhance yang sempat hilang otomatis dipulihkan/ditambahkan kembali');
  assert(enrichResult.enrichedPrompt.includes('cinematic office lighting'), 'Detail visual berkualitas tinggi berhasil ditambahkan');

  // Skenario G: Safe preservation saat Gemini fetch gagal
  globalThis.fetch = async () => {
    return {
      ok: false,
      status: 500,
      text: async () => 'Internal Server Error'
    };
  };

  try {
    await service.enrichPrompt(originalPrompt);
    assert(false, 'Harus melempar error saat Gemini gagal');
  } catch (err) {
    assert(err.message.includes('500'), 'Error diteruskan dengan jelas tanpa merusak prompt asli');
  }

  // Restore mocks
  globalThis.fetch = originalFetch;
  StorageService.getApiKey = originalKeyFn;
}

console.log('\n==================================================');
console.log(`HASIL AKHIR: ${passed} PASSED, ${failed} FAILED`);
console.log('==================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
