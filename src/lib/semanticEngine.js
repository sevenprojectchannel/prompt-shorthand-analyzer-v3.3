/**
 * Semantic Engine V2.1
 * Semantic Shorthand Knowledge Base-Driven Pipeline:
 * USER PROMPT -> SEMANTIC INTENT -> AREA / ENTITY EXTRACTION ->
 * CATALOG SEMANTIC SEARCH -> CANDIDATE SHORTHANDS -> COMPATIBILITY CHECK ->
 * CONFLICT CHECK -> RELEVANCE SCORING -> RECOMMENDATION LEVEL (WAJIB, DISARANKAN, OPSIONAL) ->
 * EXCLUSIONS -> PROMPT OPTIMAL.
 */

import { INITIAL_SHORTHAND_CATALOG, matchShorthandScore } from '../data/catalogData.js';
import { globalPatchManager } from '../patches/index.js';

export class SemanticEngine {
  constructor(catalog = INITIAL_SHORTHAND_CATALOG, patchManager = globalPatchManager) {
    this.catalog = catalog;
    this.patchManager = patchManager;
  }

  setCatalog(catalog) {
    this.catalog = catalog;
  }

  /**
   * Main pipeline execution
   */
  analyze(rawPrompt, installedOverrides = null) {
    if (!rawPrompt || typeof rawPrompt !== 'string' || !rawPrompt.trim()) {
      return this.getEmptyResult();
    }

    const normalizedPrompt = this.normalize(rawPrompt);
    const existingShorthands = this.extractExistingShorthands(rawPrompt);
    const textWithoutShorthands = this.stripShorthands(rawPrompt);

    // 1. Semantic Intent Analysis
    const intentData = this.analyzeIntent(textWithoutShorthands);

    // 2. Area & Entity Extraction (Separating Edit vs Preservation)
    const { editAreas, lockedAreas, unchangedAreas } = this.extractAreas(textWithoutShorthands, intentData);

    // 3. Primary Shorthands Detection & Deduplication (Direct User Intent)
    const primaryCandidates = this.queryPrimaryShorthands(textWithoutShorthands, editAreas, lockedAreas, intentData);
    const primaryShorthands = this.deduplicateByFunctionGroup(primaryCandidates).map(p => ({
      ...p,
      isPrimary: true,
      checked: true,
      priority: 'WAJIB'
    }));

    // 4. Relationship Discovery & Related Shorthands (OFF by default, semantic deduplicated, no arbitrary limit)
    const relatedShorthands = this.discoverRelatedShorthands(textWithoutShorthands, primaryShorthands, editAreas, lockedAreas);

    // Combine into all recommendations (Primary first, then Related)
    const recommendations = [...primaryShorthands, ...relatedShorthands];

    // 5. Conflict Detection (Lock vs Edit & Shorthand Conflict Matrix)
    const conflicts = this.detectConflicts(editAreas, lockedAreas, primaryShorthands, existingShorthands);

    // 6. Exclusions (Shorthands not needed)
    const exclusions = this.evaluateExclusions(recommendations, primaryShorthands);

    // 7. Installed Shorthands determination (Primary active by default, or user override)
    let installedShorthands = [];
    if (installedOverrides && Array.isArray(installedOverrides)) {
      installedShorthands = [...installedOverrides];
    } else {
      // Primary shorthands are installed by default, sorted by prompt natural order
      const autoInclude = primaryShorthands
        .sort((a, b) => (a.promptIndex ?? 999) - (b.promptIndex ?? 999))
        .map(r => r.code);
      const set = new Set([...existingShorthands, ...autoInclude]);
      installedShorthands = Array.from(set);
    }

    // Sync checked and active states on recommendations based on installedShorthands
    for (const rec of recommendations) {
      rec.checked = installedShorthands.includes(rec.code);
      rec.active = rec.checked;
    }

    // 8. Visual Transformation FROM -> TO
    const visualTransformation = this.generateVisualTransformation(editAreas, lockedAreas, textWithoutShorthands);

    // 9. Optimal Prompt Construction (Main Prompt + Primary + Checked Related only)
    const optimalPrompt = this.buildOptimalPrompt(textWithoutShorthands, installedShorthands);

    const baseResult = {
      rawPrompt,
      normalizedPrompt,
      cleanText: textWithoutShorthands,
      intent: intentData,
      editAreas,
      lockedAreas,
      unchangedAreas,
      conflicts,
      primaryShorthands,
      relatedShorthands,
      recommendations,
      exclusions,
      installedShorthands,
      visualTransformation,
      optimalPrompt,
      timestamp: new Date().toISOString()
    };

    if (this.patchManager && typeof this.patchManager.safeExecuteHook === 'function') {
      return this.patchManager.safeExecuteHook('afterAnalysis', baseResult, {
        engine: this,
        patchManager: this.patchManager,
        rawPrompt
      });
    }

    return baseResult;
  }

  normalize(prompt) {
    return prompt.trim().replace(/\s+/g, ' ');
  }

  extractExistingShorthands(prompt) {
    const regex = /\/([a-zA-Z0-9_\-:]+(?:\s+[0-9:]+)?)/g;
    const matches = [];
    let match;
    while ((match = regex.exec(prompt)) !== null) {
      matches.push(match[0]);
    }
    return Array.from(new Set(matches));
  }

  stripShorthands(prompt) {
    return prompt
      .replace(/\/[a-zA-Z0-9_\-:]+(?:\s+[0-9:]+)?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  analyzeIntent(text) {
    const lower = text.toLowerCase();
    let primaryAction = 'MODIFIKASI_VISUAL';
    let primaryTarget = 'Gambar';
    let summary = 'Memproses instruksi visual pada gambar.';
    let priority = 'MEDIUM';
    let category = 'GENERAL';

    if (lower.includes('pencahayaan') || lower.includes('lighting') || lower.includes('terangkan') || lower.includes('gelap')) {
      primaryAction = 'PENINGKATAN_PENCAHAYAAN';
      primaryTarget = 'Pencahayaan & Tata Cahaya';
      summary = 'Memperbaiki dan meningkatkan kualitas pencahayaan serta dynamic range pada foto.';
      priority = 'HIGH';
      category = 'LIGHTING';
    } else if (lower.includes('hijab') || lower.includes('kerudung') || lower.includes('headwear') || lower.includes('penutup kepala')) {
      primaryAction = 'PELEPASAN_PENUTUP_KEPALA';
      primaryTarget = 'Hijab / Penutup Kepala';
      summary = 'Melepaskan atau menghapus penutup kepala/hijab dengan rekonstruksi rambut alami subjek.';
      priority = 'HIGH';
      category = 'HEADWEAR';
    } else if (lower.includes('baju') || lower.includes('pakaian') || lower.includes('outfit') || lower.includes('tanktop') || lower.includes('gaun') || lower.includes('kemeja')) {
      primaryAction = 'PENGGANTIAN_BUSANA';
      primaryTarget = 'Pakaian & Outfit';
      summary = 'Mengganti busana subjek sesuai spesifikasi pakaian yang diminta.';
      priority = 'HIGH';
      category = 'OUTFIT';
    } else if (lower.includes('tajam') || lower.includes('sharpen') || lower.includes('perjelas') || lower.includes('jernih') || lower.includes('ketajaman')) {
      primaryAction = 'PENAJAMAN_DETAIL';
      primaryTarget = 'Mikrokontras & Detail';
      summary = 'Meningkatkan mikrokontras ketajaman tekstur dan resolusi visual foto.';
      priority = 'HIGH';
      category = 'IMAGE_QUALITY';
    } else if (lower.includes('hapus latar') || lower.includes('hapus background') || lower.includes('transparan') || lower.includes('hilangkan background') || lower.includes('buang background')) {
      primaryAction = 'PENGHAPUSAN_LATAR';
      primaryTarget = 'Latar Belakang / Background';
      summary = 'Mengisolasi subjek utama dan menghapus latar belakang menjadi transparan (matte alpha).';
      priority = 'CRITICAL';
      category = 'TRANSPARENCY';
    } else if (lower.includes('ganti background') || lower.includes('ganti latar') || lower.includes('latar baru') || lower.includes('gunakan latar baru') || lower.includes('pemandangan baru')) {
      primaryAction = 'PENGGANTIAN_LATAR';
      primaryTarget = 'Latar Belakang / Background';
      summary = 'Mengganti latar belakang dengan pemandangan atau suasana lingkungan baru.';
      priority = 'HIGH';
      category = 'BACKGROUND';
    } else if (lower.includes('rasio') || lower.includes('9:16') || lower.includes('16:9') || lower.includes('1:1') || lower.includes('4:5') || lower.includes('aspect ratio')) {
      primaryAction = 'PENYESUAIAN_RASIO_KANVAS';
      primaryTarget = 'Kanvas & Dimensi';
      summary = 'Menyetel rasio kanvas gambar ke dimensi target yang ditentukan.';
      priority = 'HIGH';
      category = 'CANVAS_RATIO';
    } else if (lower.includes('rambut') || lower.includes('hair') || lower.includes('botak') || lower.includes('cukur')) {
      primaryAction = 'MODIFIKASI_RAMBUT';
      primaryTarget = 'Rambut & Gaya Rambut';
      summary = 'Menyesuaikan struktur, warna, atau gaya potongan rambut subjek.';
      priority = 'HIGH';
      category = 'HAIR';
    } else if (
      lower.includes('montok') ||
      lower.includes('berisi') ||
      lower.includes('curvy') ||
      lower.includes('voluptuous') ||
      lower.includes('plussize') ||
      lower.includes('fullfigured') ||
      lower.includes('tubuh montok') ||
      lower.includes('badan montok') ||
      lower.includes('tubuh berlekuk')
    ) {
      primaryAction = 'MODIFIKASI_BENTUK_TUBUH';
      primaryTarget = 'Bentuk Tubuh & Proporsi Lekuk';
      summary = 'Menyesuaikan bentuk dan proporsi tubuh menjadi montok / berisi secara natural.';
      priority = 'HIGH';
      category = 'BODY_POSE';
    } else if (
      lower.includes('tangan') ||
      lower.includes('jari') ||
      lower.includes('hand') ||
      lower.includes('hands') ||
      lower.includes('finger') ||
      lower.includes('fingers') ||
      lower.includes('anatomi tangan')
    ) {
      primaryAction = 'PENYEMPURNAAN_ANATOMI_TANGAN';
      primaryTarget = 'Tangan & Jari Subjek';
      summary = 'Menyempurnakan proporsi anatomi tangan dan jari agar tampak natural dan sempurna.';
      priority = 'HIGH';
      category = 'BODY_POSE';
    } else if (
      lower.includes('resolusi') ||
      lower.includes('resolution') ||
      lower.includes('high res') ||
      lower.includes('super resolution') ||
      lower.includes('4k') ||
      lower.includes('8k') ||
      lower.includes('upscale') ||
      lower.includes('kualitas tinggi')
    ) {
      primaryAction = 'PENINGKATAN_RESOLUSI';
      primaryTarget = 'Resolusi & Detail Gambar';
      summary = 'Meningkatkan resolusi dan kejernihan mikrotekstur gambar ke standar resolusi tinggi.';
      priority = 'HIGH';
      category = 'IMAGE_QUALITY';
    } else if (
      lower.includes('memperluas foto') ||
      lower.includes('perluas foto') ||
      lower.includes('perluas kanvas') ||
      lower.includes('perlebar foto') ||
      lower.includes('perlebar gambar') ||
      lower.includes('perpanjang foto') ||
      lower.includes('outpaint') ||
      lower.includes('outpainting') ||
      lower.includes('uncrop') ||
      lower.includes('expand canvas') ||
      lower.includes('canvas extension')
    ) {
      primaryAction = 'PERLUASAN_KANVAS_OUTPAINT';
      primaryTarget = 'Bidang & Batas Kanvas Foto';
      summary = 'Memperluas dimensi bidang gambar di luar batas kanvas asli (AI Outpainting & Frame Extension).';
      priority = 'HIGH';
      category = 'CANVAS_RATIO';
    }

    return {
      primaryAction,
      primaryTarget,
      summary,
      priority,
      category
    };
  }

  extractAreas(text, intentData) {
    const lower = text.toLowerCase();
    const editAreas = [];
    const lockedAreas = [];
    const detectedTargets = new Set();

    // Helper: checks if entity is explicitly locked/preserved
    const checkPreservation = (entityKeywords) => {
      for (const kw of entityKeywords) {
        if (!lower.includes(kw)) continue;
        const preservationPatterns = [
          `jangan ubah ${kw}`,
          `jangan ganti ${kw}`,
          `jangan sentuh ${kw}`,
          `jangan mengubah ${kw}`,
          `pertahankan ${kw}`,
          `kunci ${kw}`,
          `jaga ${kw}`,
          `${kw} asli`,
          `${kw} tetap`,
          `${kw} sama`,
          `${kw} harus tetap sama`,
          `keep ${kw}`,
          `same ${kw}`,
          `preserve ${kw}`
        ];
        if (preservationPatterns.some(p => lower.includes(p))) {
          return true;
        }
      }
      return false;
    };

    // Helper: checks if entity is explicitly edited
    const checkEdit = (entityKeywords) => {
      for (const kw of entityKeywords) {
        if (!lower.includes(kw)) continue;
        const editPatterns = [
          `ubah ${kw}`,
          `ganti ${kw}`,
          `hapus ${kw}`,
          `hilangkan ${kw}`,
          `perbaiki ${kw}`,
          `tingkatkan ${kw}`,
          `buat ${kw}`,
          `lepas ${kw}`,
          `lepaskan ${kw}`,
          `buka ${kw}`,
          `change ${kw}`,
          `remove ${kw}`
        ];
        if (editPatterns.some(p => lower.includes(p))) {
          return true;
        }
        // Direct descriptive patterns
        if (kw === 'pencahayaan' && (lower.includes('perbaiki pencahayaan') || lower.includes('lighting') || lower.includes('terangkan'))) return true;
        if (kw === 'hijab' && (lower.includes('hapus hijab') || lower.includes('lepas hijab') || lower.includes('lepaskan hijab') || lower.includes('tanpa hijab'))) return true;
        if (kw === 'baju' && (lower.includes('tanktop') || lower.includes('kemeja') || lower.includes('gaun') || lower.includes('jaket'))) return true;
        if (kw === 'rasio' && (lower.includes('9:16') || lower.includes('16:9') || lower.includes('1:1') || lower.includes('4:5'))) return true;
        if (kw === 'latar' && (lower.includes('latar baru') || lower.includes('gunakan latar baru') || lower.includes('hapus latar'))) return true;
      }
      return false;
    };

    // 1. WAJAH (FACE)
    const faceKw = ['wajah', 'muka', 'face', 'identitas', 'paras'];
    if (faceKw.some(k => lower.includes(k))) {
      detectedTargets.add('FACE');
      if (checkPreservation(faceKw)) {
        lockedAreas.push({
          entity: 'FACE',
          label: 'Wajah & Identitas',
          action: 'LOCKED',
          description: 'Fitur wajah, mata, bibir, hidung, dan ekspresi asli subjek dikunci 100%.',
          shorthand: '/facelock'
        });
      } else if (checkEdit(faceKw)) {
        editAreas.push({
          entity: 'FACE',
          label: 'Wajah & Fitur Wajah',
          action: 'EDIT',
          description: 'Memodifikasi karakteristik atau ekspresi wajah subjek.',
          shorthand: lower.includes('ganti wajah') ? '/facechange' : '/faceedit'
        });
      }
    }

    // 2. PENUTUP KEPALA / HIJAB
    const headwearKw = ['hijab', 'kerudung', 'jilbab', 'penutup kepala', 'topi'];
    if (headwearKw.some(k => lower.includes(k))) {
      detectedTargets.add('HEADWEAR');
      if (checkPreservation(headwearKw)) {
        lockedAreas.push({
          entity: 'HEADWEAR',
          label: 'Penutup Kepala / Hijab',
          action: 'LOCKED',
          description: 'Penutup kepala asli dipertahankan tanpa perubahan.',
          shorthand: '/headwearlock'
        });
      } else {
        editAreas.push({
          entity: 'HEADWEAR',
          label: 'Penutup Kepala / Hijab',
          action: 'REMOVE / EDIT',
          description: 'Menghapus atau melepaskan penutup kepala/hijab dengan rekonstruksi rambut alami.',
          shorthand: '/headwear-remove'
        });
      }
    }

    // 3. PAKAIAN / OUTFIT
    const outfitKw = ['baju', 'pakaian', 'outfit', 'busana', 'tanktop', 'kemeja', 'celana', 'gaun', 'jaket'];
    if (outfitKw.some(k => lower.includes(k))) {
      detectedTargets.add('OUTFIT');
      if (checkPreservation(outfitKw)) {
        lockedAreas.push({
          entity: 'OUTFIT',
          label: 'Pakaian & Busana',
          action: 'LOCKED',
          description: 'Busana dan tekstur kain asli subjek tetap dipertahankan.',
          shorthand: '/outfitlock'
        });
      } else {
        let outfitDetail = 'Pakaian subjek';
        if (lower.includes('tanktop putih tali tipis')) outfitDetail = 'Tanktop putih tali tipis';
        else if (lower.includes('tanktop')) outfitDetail = 'Tanktop';
        else if (lower.includes('gaun')) outfitDetail = 'Gaun';
        else if (lower.includes('kemeja')) outfitDetail = 'Kemeja';

        editAreas.push({
          entity: 'OUTFIT',
          label: 'Pakaian (Outfit)',
          action: 'REPLACE',
          description: `Mengganti pakaian subjek menjadi: ${outfitDetail}.`,
          shorthand: '/outfit'
        });
      }
    }

    // 4. LATAR BELAKANG (BACKGROUND)
    const bgKw = ['latar', 'background', 'backdrop', 'lingkungan'];
    if (bgKw.some(k => lower.includes(k))) {
      detectedTargets.add('BACKGROUND');
      if (checkPreservation(bgKw)) {
        lockedAreas.push({
          entity: 'BACKGROUND',
          label: 'Latar Belakang (Background)',
          action: 'LOCKED',
          description: 'Lingkungan, latar belakang, dan pencahayaan ambien dikunci.',
          shorthand: '/backgroundlock'
        });
      } else if (lower.includes('hapus') || lower.includes('transparan') || lower.includes('hilangkan') || lower.includes('buang')) {
        editAreas.push({
          entity: 'BACKGROUND',
          label: 'Latar Belakang (Background)',
          action: 'REMOVE / TRANSPARENT',
          description: 'Latar belakang dihapus dan diubah menjadi transparan bersih.',
          shorthand: '/bgremove'
        });
      } else if (lower.includes('ganti') || lower.includes('ubah') || lower.includes('baru') || lower.includes('gunakan latar baru') || lower.includes('studio')) {
        editAreas.push({
          entity: 'BACKGROUND',
          label: 'Latar Belakang (Background)',
          action: 'REPLACE',
          description: 'Mengganti latar belakang dengan suasana atau pemandangan baru.',
          shorthand: '/bgreplace'
        });
      }
    }

    // 5. PENCAHAYAAN (LIGHTING)
    if (lower.includes('pencahayaan') || lower.includes('lighting') || lower.includes('terangkan') || lower.includes('cahaya')) {
      detectedTargets.add('LIGHTING');
      editAreas.push({
        entity: 'LIGHTING',
        label: 'Pencahayaan (Lighting)',
        action: 'ENHANCE',
        description: 'Pencahayaan foto dioptimalkan, menyeimbangkan highlight dan shadow.',
        shorthand: '/enhance'
      });
    }

    // 6. KETAJAMAN & KUALITAS (SHARPNESS & RESOLUTION)
    const resolusiKw = ['resolusi', 'resolution', 'high res', 'super resolution', '4k', '8k', 'upscale', 'kualitas tinggi'];
    const hasResolusi = resolusiKw.some(k => lower.includes(k));

    if (hasResolusi) {
      detectedTargets.add('IMAGE_QUALITY');
      editAreas.push({
        entity: 'IMAGE_QUALITY',
        label: 'Resolusi & Mikrotekstur Gambar',
        action: 'HIGH_RESOLUTION',
        description: 'Resolusi dan kepadatan piksel ditingkatkan ke tingkat resolusi ultra-tinggi.',
        shorthand: '/highresolution'
      });
    } else if (lower.includes('tajam') || lower.includes('sharpen') || lower.includes('perjelas') || lower.includes('detail') || lower.includes('ketajaman')) {
      detectedTargets.add('IMAGE_QUALITY');
      editAreas.push({
        entity: 'IMAGE_QUALITY',
        label: 'Ketajaman & Mikrokontras',
        action: 'SHARPEN',
        description: 'Detail halus dan mikrokontras foto dipertajam secara profesional.',
        shorthand: '/sharpen'
      });
    }

    // 7. RASIO ASPEK (ASPECT RATIO / CANVAS)
    if (lower.includes('rasio') || lower.includes('9:16') || lower.includes('16:9') || lower.includes('1:1') || lower.includes('4:5') || lower.includes('format')) {
      detectedTargets.add('CANVAS_RATIO');
      let targetRatio = 'Rasio baru';
      let code = '/ar 9:16';
      if (lower.includes('9:16')) { targetRatio = '9:16 (Vertical)'; code = '/ar 9:16'; }
      else if (lower.includes('16:9')) { targetRatio = '16:9 (Landscape)'; code = '/ar 16:9'; }
      else if (lower.includes('1:1')) { targetRatio = '1:1 (Persegi)'; code = '/ar 1:1'; }
      else if (lower.includes('4:5')) { targetRatio = '4:5 (Portrait)'; code = '/ar 4:5'; }

      editAreas.push({
        entity: 'CANVAS_RATIO',
        label: 'Dimensi & Rasio Kanvas',
        action: 'SET_ASPECT_RATIO',
        description: `Mengatur rasio kanvas gambar menjadi format ${targetRatio}.`,
        shorthand: code
      });
    }

    // 7B. PERLUASAN FOTO & OUTPAINTING (CANVAS EXTENSION)
    const outpaintKw = ['memperluas foto', 'perluas foto', 'perluas kanvas', 'perlebar foto', 'perlebar gambar', 'perpanjang foto', 'outpaint', 'outpainting', 'uncrop', 'expand canvas', 'canvas extension'];
    if (outpaintKw.some(k => lower.includes(k))) {
      detectedTargets.add('CANVAS_RATIO');
      editAreas.push({
        entity: 'CANVAS_RATIO',
        label: 'Ekspansi Kanvas & Outpainting',
        action: 'PERLUASAN_KANVAS_OUTPAINT',
        description: 'Memperluas bidang foto di luar batas kanvas asli (AI Outpainting) secara koheren dan mulus.',
        shorthand: '/outpaint'
      });
    }

    // 8. FRAMING / FULL BODY
    if (lower.includes('full body') || lower.includes('seluruh tubuh') || lower.includes('badan penuh')) {
      detectedTargets.add('BODY_POSE');
      editAreas.push({
        entity: 'BODY_POSE',
        label: 'Komposisi & Framing',
        action: 'FULL_BODY_EXPAND',
        description: 'Memperluas framing gambar untuk menampilkan subjek dari kepala hingga kaki.',
        shorthand: '/fullbody'
      });
    }

    // 9. RAMBUT (HAIR)
    const hairKw = ['rambut', 'hair', 'botak', 'cukur'];
    if (hairKw.some(k => lower.includes(k))) {
      detectedTargets.add('HAIR');
      const isPreserved = checkPreservation(hairKw);
      const isEdited = checkEdit(hairKw) || lower.includes('botak') || lower.includes('merah') || lower.includes('cat') || lower.includes('gaya rambut');

      if (isPreserved && isEdited) {
        // Both preserved AND edited -> This triggers CONFLICT DETECTED
        lockedAreas.push({
          entity: 'HAIR',
          label: 'Rambut Subjek',
          action: 'LOCKED',
          description: 'Mempertahankan rambut asli subjek.',
          shorthand: '/hairlock'
        });
        editAreas.push({
          entity: 'HAIR',
          label: 'Rambut Subjek',
          action: 'EDIT_STYLE',
          description: lower.includes('botak') ? 'Memangkas rambut menjadi botak' : 'Mengubah gaya rambut subjek',
          shorthand: '/hairchange'
        });
      } else if (isPreserved) {
        lockedAreas.push({
          entity: 'HAIR',
          label: 'Rambut Subjek',
          action: 'LOCKED',
          description: 'Gaya dan warna rambut asli dipertahankan konsisten.',
          shorthand: '/hairlock'
        });
      } else if (isEdited) {
        editAreas.push({
          entity: 'HAIR',
          label: 'Rambut Subjek',
          action: 'EDIT',
          description: lower.includes('botak') ? 'Mengubah gaya rambut menjadi botak' : 'Mengubah gaya atau warna rambut',
          shorthand: '/hairchange'
        });
      }
    }

    // 10. TUBUH / BODY POSE
    const bodyKw = ['tubuh', 'badan', 'pose', 'postur'];
    const voluptuousKw = ['montok', 'berisi', 'curvy', 'voluptuous', 'plussize', 'fullfigured', 'berlekuk', 'hourglass'];
    const hasVoluptuous = voluptuousKw.some(k => lower.includes(k));
    const hasBody = bodyKw.some(k => lower.includes(k));

    if (hasBody || hasVoluptuous) {
      detectedTargets.add('BODY_POSE');
      const isPreserved = checkPreservation([...bodyKw, ...voluptuousKw]);

      if (isPreserved) {
        lockedAreas.push({
          entity: 'BODY_POSE',
          label: 'Postur Tubuh & Anatomi',
          action: 'LOCKED',
          description: 'Pose, siluet, dan proporsi anatomis tubuh dipertahankan.',
          shorthand: '/bodylock'
        });
      } else if (hasVoluptuous) {
        editAreas.push({
          entity: 'BODY_POSE',
          label: 'Bentuk Tubuh & Proporsi Lekuk',
          action: 'VOLUPTUOUS_SHAPE',
          description: 'Bentuk dan lekuk tubuh disesuaikan menjadi montok / berisi secara natural.',
          shorthand: '/bodyvoluptuous'
        });
      }
    }

    // 11. TANGAN & JARI / HANDS & FINGERS
    const handKw = ['tangan', 'jari', 'hand', 'hands', 'finger', 'fingers', 'anatomi tangan'];
    if (handKw.some(k => lower.includes(k))) {
      detectedTargets.add('BODY_POSE');
      const isPreserved = checkPreservation(handKw);
      if (isPreserved) {
        lockedAreas.push({
          entity: 'BODY_POSE',
          label: 'Anatomi Tangan & Jari',
          action: 'LOCKED',
          description: 'Bentuk dan posisi tangan asli dipertahankan konsisten.',
          shorthand: '/bodylock'
        });
      } else {
        editAreas.push({
          entity: 'BODY_POSE',
          label: 'Anatomi Tangan & Jari',
          action: 'HAND_PERFECT_ANATOMY',
          description: 'Proporsi tangan dan jari disempurnakan menjadi natural dan proporsional.',
          shorthand: '/handperfect'
        });
      }
    }

    // Determine unchanged areas: all standard domains not touched
    const allKnownDomains = [
      { key: 'FACE', label: 'Wajah & Identitas' },
      { key: 'BACKGROUND', label: 'Latar Belakang' },
      { key: 'OUTFIT', label: 'Pakaian & Busana' },
      { key: 'BODY_POSE', label: 'Postur & Anatomi Tubuh' },
      { key: 'LIGHTING', label: 'Pencahayaan' }
    ];

    const unchangedAreas = allKnownDomains
      .filter(d => !detectedTargets.has(d.key))
      .map(d => ({
        entity: d.key,
        label: d.label,
        status: 'UNCHANGED',
        description: `Tidak termodifikasi karena tidak ada permintaan perubahan pada ${d.label.toLowerCase()}.`
      }));

    return { editAreas, lockedAreas, unchangedAreas };
  }

  /**
   * Helper to find the earliest occurrence of an item's triggers or entity keywords in prompt
   */
  findPromptIndex(text, item, extraKeywords = []) {
    const lower = text.toLowerCase();
    let minIdx = 999;
    const candidates = [...(item.semanticTriggers || []), ...extraKeywords];
    for (const cand of candidates) {
      if (!cand || cand.length < 3) continue;
      const idx = lower.indexOf(cand.toLowerCase());
      if (idx !== -1 && idx < minIdx) {
        minIdx = idx;
      }
    }
    return minIdx;
  }

  /**
   * Query Primary Shorthands directly linked to user intent
   */
  queryPrimaryShorthands(text, editAreas, lockedAreas, intentData) {
    const candidateMap = new Map();

    // 1. Direct matches from locked areas (WAJIB)
    for (const lock of lockedAreas) {
      if (lock.shorthand) {
        const item = this.catalog.find(c => c.code === lock.shorthand);
        if (item) {
          const promptIdx = this.findPromptIndex(text, item, [lock.label, lock.entity, 'jangan', 'pertahankan', 'kunci']);
          candidateMap.set(item.code, {
            item,
            code: item.code,
            name: item.name,
            category: item.category,
            target: lock.label,
            priority: 'WAJIB',
            reason: `Kritis untuk menjamin ${lock.description.toLowerCase()}`,
            score: 100,
            promptIndex: promptIdx
          });
        }
      }
    }

    // 2. Direct matches from edit areas (WAJIB)
    for (const edit of editAreas) {
      if (edit.shorthand) {
        const item = this.catalog.find(c => c.code === edit.shorthand);
        if (item) {
          const promptIdx = this.findPromptIndex(text, item, [edit.label, edit.entity, 'ubah', 'ganti', 'hapus']);
          candidateMap.set(item.code, {
            item,
            code: item.code,
            name: item.name,
            category: edit.category || item.category,
            target: edit.label,
            priority: 'WAJIB',
            reason: `Mendukung eksekusi ${edit.description.toLowerCase()}`,
            score: 95,
            promptIndex: promptIdx
          });
        }
      }
    }

    // 3. Synergy enhancers directly tied to edited areas
    if (editAreas.some(e => e.entity === 'LIGHTING') && !candidateMap.has('/enhance')) {
      const enhanceItem = this.catalog.find(c => c.code === '/enhance');
      if (enhanceItem) {
        candidateMap.set('/enhance', {
          item: enhanceItem,
          code: enhanceItem.code,
          name: enhanceItem.name,
          category: enhanceItem.category,
          target: 'Seluruh Gambar',
          priority: 'WAJIB',
          reason: 'Mendukung peningkatan dan penyeimbangan kualitas visual pencahayaan secara menyeluruh.',
          score: 85,
          promptIndex: this.findPromptIndex(text, enhanceItem, ['pencahayaan', 'lighting'])
        });
      }
    }

    if (editAreas.some(e => e.entity === 'IMAGE_QUALITY') && !candidateMap.has('/sharpen') && !candidateMap.has('/highresolution')) {
      const sharpenItem = this.catalog.find(c => c.code === '/sharpen');
      if (sharpenItem) {
        candidateMap.set('/sharpen', {
          item: sharpenItem,
          code: sharpenItem.code,
          name: sharpenItem.name,
          category: sharpenItem.category,
          target: 'Detail & Mikrokontras',
          priority: 'WAJIB',
          reason: 'Meningkatkan kejernihan tekstur dan mikrokontras tepian objek.',
          score: 85,
          promptIndex: this.findPromptIndex(text, sharpenItem, ['tajam', 'sharpen'])
        });
      }
    }

    // 4. Match items against Knowledge Base semanticTriggers for direct prompt actions
    for (const item of this.catalog) {
      if (candidateMap.has(item.code)) continue;

      const score = matchShorthandScore(item, text);
      if (score >= 70) {
        // Do not add items that conflict with an active lock
        const conflictsWithLock = lockedAreas.some(lock => {
          if (lock.shorthand && item.conflicts && item.conflicts.includes(lock.shorthand)) return true;
          const lockItem = this.catalog.find(c => c.code === lock.shorthand);
          if (lockItem && lockItem.conflicts && lockItem.conflicts.includes(item.code)) return true;
          return false;
        });
        if (conflictsWithLock) continue;

        // Do not promote items that are defined as ALTERNATIVE to an existing primary candidate
        const isAlternativeOfPrimary = Array.from(candidateMap.values()).some(prim => {
          return prim.item?.relationships?.some(r => r.code === item.code && r.relationType === 'ALTERNATIVE');
        });
        if (isAlternativeOfPrimary) continue;

        const isLock = item.category === 'LOCK_PRESERVATION';
        const promptIdx = this.findPromptIndex(text, item);
        candidateMap.set(item.code, {
          item,
          code: item.code,
          name: item.name,
          category: item.category,
          target: item.target,
          priority: 'WAJIB',
          reason: `Instruksi user cocok dengan trigger semantik '${item.name}'.`,
          score,
          promptIndex: promptIdx
        });
      }
    }

    return Array.from(candidateMap.values());
  }

  /**
   * Semantic Function Deduplication:
   * Satu Fungsi Semantik (functionGroup) = Satu Shorthand Representatif Terbaik.
   * Kandidat lain disimpan sebagai equivalentTo pada representatif.
   */
  deduplicateByFunctionGroup(candidates) {
    const groupMap = new Map();

    for (const cand of candidates) {
      const fg = cand.item?.functionGroup || cand.item?.category || cand.code;
      if (!groupMap.has(fg)) {
        groupMap.set(fg, [cand]);
      } else {
        groupMap.get(fg).push(cand);
      }
    }

    const result = [];
    for (const [fg, items] of groupMap.entries()) {
      if (items.length === 1) {
        result.push(items[0]);
        continue;
      }

      // Priority sort:
      // 1. preferredRepresentative === true
      // 2. status: CORE > APPROVED > CUSTOM > DISCOVERED
      // 3. higher score
      // 4. shorter code length / clarity
      items.sort((a, b) => {
        const prefA = a.item?.preferredRepresentative ? 1 : 0;
        const prefB = b.item?.preferredRepresentative ? 1 : 0;
        if (prefB !== prefA) return prefB - prefA;

        const statusWeight = { CORE: 4, APPROVED: 3, CUSTOM: 2, DISCOVERED: 1, DISABLED: 0 };
        const sA = statusWeight[a.item?.status] || 2;
        const sB = statusWeight[b.item?.status] || 2;
        if (sB !== sA) return sB - sA;

        if ((b.score || 0) !== (a.score || 0)) return (b.score || 0) - (a.score || 0);

        return a.code.length - b.code.length;
      });

      const representative = { ...items[0] };
      const otherCodes = items.slice(1).map(i => i.code);
      const combinedEquivalents = Array.from(new Set([
        ...(representative.item?.equivalentTo || []),
        ...otherCodes,
        ...items.slice(1).flatMap(i => i.item?.equivalentTo || [])
      ])).filter(c => c !== representative.code);

      representative.item = {
        ...representative.item,
        equivalentTo: combinedEquivalents
      };
      representative.equivalentTo = combinedEquivalents;

      result.push(representative);
    }

    return result;
  }

  /**
   * Conflict check helper between an item and active locks / primaries
   */
  hasConflict(item, lockedShorthands, primaryCodes) {
    if (!item) return false;
    for (const lockCode of lockedShorthands) {
      if (item.code === lockCode) continue;
      if (item.conflicts && item.conflicts.includes(lockCode)) return true;
      const lockItem = this.catalog.find(c => c.code === lockCode);
      if (lockItem && lockItem.conflicts && lockItem.conflicts.includes(item.code)) return true;
    }
    for (const primCode of primaryCodes) {
      if (item.code === primCode) continue;
      if (item.conflicts && item.conflicts.includes(primCode)) return true;
      const primItem = this.catalog.find(c => c.code === primCode);
      if (primItem && primItem.conflicts && primItem.conflicts.includes(item.code)) return true;
    }
    return false;
  }

  /**
   * Discover related shorthands using Semantic Graph and catalog relationships.
   * Related shorthands are OFF by default and deduplicated by functionGroup.
   * No arbitrary limit (all distinct relevant function groups are included).
   */
  discoverRelatedShorthands(text, primaryCandidates, editAreas, lockedAreas) {
    const primaryCodes = new Set(primaryCandidates.map(c => c.code));
    for (const p of primaryCandidates) {
      if (p.equivalentTo) {
        for (const eq of p.equivalentTo) primaryCodes.add(eq);
      }
    }

    const primaryFunctionGroups = new Set(primaryCandidates.map(c => c.item?.functionGroup || c.item?.category));
    const primaryEntities = new Set([
      ...editAreas.map(e => e.entity),
      ...lockedAreas.map(l => l.entity)
    ]);

    const lockedShorthands = new Set(lockedAreas.map(l => l.shorthand).filter(Boolean));
    const relatedMap = new Map();

    // 1. Direct relationships defined in primary items
    for (const prim of primaryCandidates) {
      const rels = prim.item?.relationships || [];
      for (const rel of rels) {
        if (!rel.code || primaryCodes.has(rel.code)) continue;

        const targetItem = this.catalog.find(c => c.code === rel.code);
        if (!targetItem) continue;

        if (this.hasConflict(targetItem, lockedShorthands, primaryCodes)) continue;
        if (matchShorthandScore(targetItem, text) < 0) continue;

        const fg = targetItem.functionGroup || targetItem.category;
        if (primaryFunctionGroups.has(fg)) continue;

        // Semantic validation: do not introduce headwear removal unless headwear is an active domain in prompt
        if (targetItem.category === 'HEADWEAR' && !primaryEntities.has('HEADWEAR')) {
          continue;
        }

        if (!relatedMap.has(targetItem.code)) {
          relatedMap.set(targetItem.code, {
            item: targetItem,
            code: targetItem.code,
            name: targetItem.name,
            category: targetItem.category,
            target: targetItem.target,
            functionGroup: fg,
            description: targetItem.description,
            relationship: rel.relationType || 'DIRECTLY_RELATED',
            reason: rel.reason || `Berhubungan dengan ${prim.name}`,
            source: targetItem.source || 'CORE',
            priority: 'DISARANKAN',
            score: 80,
            isPrimary: false,
            checked: false
          });
        }
      }
    }

    // 2. Semantic Graph expansion across domains
    const graphConnections = {
      HEADWEAR: [
        { category: 'HAIR', relation: 'REVEALED_BY_REMOVAL', reason: 'Terekspos ketika hijab atau penutup kepala dibuka.' },
        { category: 'LOCK_PRESERVATION', target: 'FACE_IDENTITY', relation: 'PRESERVATION_RELATED', reason: 'Melindungi identitas wajah tetap konsisten saat penutup kepala dimodifikasi.' },
        { category: 'LOCK_PRESERVATION', target: 'HAIR', relation: 'PRESERVATION_RELATED', reason: 'Menjaga rambut tetap konsisten.' },
        { category: 'LIGHTING', relation: 'QUALITY_RELATED', reason: 'Menyeimbangkan pencahayaan pada bagian kepala yang baru terbuka.' },
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Menajamkan detail helai rambut natural.' }
      ],
      OUTFIT: [
        { category: 'LOCK_PRESERVATION', target: 'FACE_IDENTITY', relation: 'PRESERVATION_RELATED', reason: 'Menjaga identitas wajah tetap terlindungi saat pakaian diganti.' },
        { category: 'LOCK_PRESERVATION', target: 'BODY_POSE', relation: 'PRESERVATION_RELATED', reason: 'Menjaga proporsi tubuh dan postur asli subjek saat mengganti busana.' },
        { category: 'LOCK_PRESERVATION', target: 'HAIR', relation: 'PRESERVATION_RELATED', reason: 'Menjaga rambut tetap konsisten saat pakaian diganti.' },
        { category: 'LOCK_PRESERVATION', target: 'BACKGROUND', relation: 'PRESERVATION_RELATED', reason: 'Mengunci latar belakang asli agar fokus perubahan tertuju pada busana baru.' },
        { category: 'BODY_POSE', relation: 'CONTEXTUAL', reason: 'Menyesuaikan pose atau framing tubuh agar selaras dengan busana baru.' },
        { category: 'LIGHTING', relation: 'QUALITY_RELATED', reason: 'Menyeimbangkan pencahayaan pada kain pakaian baru.' },
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Mempertegas detail lipatan dan mikrokontras tekstur kain.' },
        { category: 'BACKGROUND', relation: 'CONTEXTUAL', reason: 'Menyelaraskan pemandangan latar belakang dengan busana baru.' },
        { category: 'COLOR_TONE', relation: 'CONTEXTUAL', reason: 'Grading tone warna agar busana menyatu secara harmonis.' },
        { category: 'STYLE_EFFECT', relation: 'CONTEXTUAL', reason: 'Penyelarasan estetika gaya visual sinematik dengan busana baru.' }
      ],
      BACKGROUND: [
        { category: 'LIGHTING', relation: 'QUALITY_RELATED', reason: 'Menyelaraskan pencahayaan subjek dengan pemandangan latar belakang.' },
        { category: 'LOCK_PRESERVATION', target: 'FACE_IDENTITY', relation: 'PRESERVATION_RELATED', reason: 'Mengunci identitas wajah di latar baru.' },
        { category: 'LOCK_PRESERVATION', target: 'OUTFIT', relation: 'PRESERVATION_RELATED', reason: 'Menjaga busana asli subjek saat latar belakang diganti.' },
        { category: 'COLOR_TONE', relation: 'CONTEXTUAL', reason: 'Menyelaraskan grading warna subjek dan background.' },
        { category: 'STYLE_EFFECT', relation: 'CONTEXTUAL', reason: 'Menyesuaikan gaya artistik scene baru.' },
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Mempertahankan ketajaman subjek terhadap latar baru.' }
      ],
      LIGHTING: [
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Menyempurnakan mikrokontras dan ketajaman setelah pencahayaan ditingkatkan.' },
        { category: 'COLOR_TONE', relation: 'CONTEXTUAL', reason: 'Memberikan nuansa tone warna estetik pada pencahayaan.' }
      ],
      IMAGE_QUALITY: [
        { category: 'LIGHTING', relation: 'QUALITY_RELATED', reason: 'Komplementer dengan peningkatan exposure dan dynamic range.' }
      ],
      CANVAS_RATIO: [
        { category: 'BODY_POSE', relation: 'COMPOSITION_RELATED', reason: 'Menyesuaikan framing tubuh (full body / portrait) sesuai format rasio.' }
      ],
      HAIR: [
        { category: 'LOCK_PRESERVATION', target: 'FACE_IDENTITY', relation: 'PRESERVATION_RELATED', reason: 'Menjaga identitas wajah saat gaya rambut disesuaikan.' },
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Menajamkan helai dan tekstur rambut.' }
      ],
      FACE: [
        { category: 'LOCK_PRESERVATION', target: 'HAIR', relation: 'PRESERVATION_RELATED', reason: 'Menjaga rambut tetap konsisten bersamaan dengan perlindungan wajah.' },
        { category: 'LOCK_PRESERVATION', target: 'BODY_POSE', relation: 'PRESERVATION_RELATED', reason: 'Menjaga postur tubuh tetap konsisten bersamaan dengan perlindungan wajah.' },
        { category: 'IMAGE_QUALITY', relation: 'QUALITY_RELATED', reason: 'Menajamkan mikrokontras dan detail ekspresi wajah subjek.' },
        { category: 'LIGHTING', relation: 'QUALITY_RELATED', reason: 'Pencahayaan yang optimal dan seimbang pada wajah subjek.' }
      ]
    };

    for (const ent of primaryEntities) {
      const connections = graphConnections[ent] || [];
      for (const conn of connections) {
        for (const item of this.catalog) {
          if (primaryCodes.has(item.code) || relatedMap.has(item.code)) continue;
          if (conn.category && item.category !== conn.category) continue;
          if (conn.target && item.target !== conn.target) continue;

          // Do not suggest headwear edits if headwear is not part of user prompt or active entities
          if (item.category === 'HEADWEAR' && !primaryEntities.has('HEADWEAR')) continue;
          // Do not suggest transparency alpha removal if background transparency wasn't requested
          if (item.category === 'TRANSPARENCY' && !primaryEntities.has('BACKGROUND')) continue;

          if (this.hasConflict(item, lockedShorthands, primaryCodes)) continue;
          if (matchShorthandScore(item, text) < 0) continue;

          const fg = item.functionGroup || item.category;
          if (primaryFunctionGroups.has(fg)) continue;

          relatedMap.set(item.code, {
            item,
            code: item.code,
            name: item.name,
            category: item.category,
            target: item.target,
            functionGroup: fg,
            description: item.description,
            relationship: conn.relation || 'CONTEXTUAL',
            reason: conn.reason || `Berhubungan dengan area ${ent}`,
            source: item.source || 'CORE',
            priority: 'DISARANKAN',
            score: 75,
            isPrimary: false,
            checked: false
          });
        }
      }
    }

    // Deduplicate related candidates by functionGroup
    const rawRelated = Array.from(relatedMap.values());
    const dedupedRelated = this.deduplicateByFunctionGroup(rawRelated).map(r => ({
      ...r,
      isPrimary: false,
      checked: false,
      priority: r.priority || 'DISARANKAN'
    }));

    return dedupedRelated;
  }

  detectConflicts(editAreas, lockedAreas, primaryShorthands, existingShorthands) {
    const conflicts = [];

    // 1. Conflict between Edit Area and Locked Area on the same entity
    for (const edit of editAreas) {
      const matchingLock = lockedAreas.find(l => l.entity === edit.entity);
      if (matchingLock) {
        const conflictItem = {
          id: `conflict-${edit.entity.toLowerCase()}`,
          entity: edit.entity,
          label: edit.label,
          type: 'EDIT_VS_LOCK',
          shorthandA: matchingLock.shorthand || `[Lock ${edit.entity}]`,
          shorthandB: edit.shorthand || `[Ubah ${edit.entity}]`,
          instructionA: matchingLock.description,
          instructionB: edit.description,
          reason: `Kedua instruksi memiliki tujuan yang bertentangan: meminta mengunci ${edit.label} sekaligus meminta mengubahnya.`,
          options: [
            { id: 'use_user_edit', label: 'Gunakan Instruksi Ubah (Abaikan Kunci)' },
            { id: 'keep_lock', label: 'Pertahankan Kunci (Batalkan Ubah)' },
            { id: 'edit_shorthand', label: 'Sesuaikan Shorthand Manual' }
          ]
        };
        conflictItem.suggestion = this.generateConflictSuggestion(conflictItem);
        conflicts.push(conflictItem);
      }
    }

    // 2. Conflict matrix defined in Knowledge Base item.conflicts
    const primaryCodes = Array.isArray(primaryShorthands)
      ? primaryShorthands.map(p => (typeof p === 'string' ? p : p.code))
      : Array.from(primaryShorthands.keys ? primaryShorthands.keys() : []);

    const activeCodes = Array.from(new Set([...primaryCodes, ...existingShorthands]));

    for (const code of activeCodes) {
      const item = this.catalog.find(c => c.code === code);
      if (!item || !item.conflicts || item.conflicts.length === 0) continue;

      for (const conflictingCode of item.conflicts) {
        if (activeCodes.includes(conflictingCode)) {
          // Avoid duplicate conflict if an EDIT_VS_LOCK already captured this pair
          const alreadyCaptured = conflicts.some(c => 
            (c.shorthandA === code && c.shorthandB === conflictingCode) ||
            (c.shorthandA === conflictingCode && c.shorthandB === code)
          );
          if (alreadyCaptured) continue;

          const conflictId = `conflict-${[code, conflictingCode].sort().join('-')}`;
          if (!conflicts.some(c => c.id === conflictId)) {
            const conflictingItem = this.catalog.find(c => c.code === conflictingCode);
            const conflictItem = {
              id: conflictId,
              entity: item.target,
              label: item.name,
              type: 'SHORTHAND_CLASH',
              shorthandA: code,
              shorthandB: conflictingCode,
              instructionA: item.description,
              instructionB: conflictingItem ? conflictingItem.description : `Konflik dengan direktif ${conflictingCode}`,
              reason: `Shorthand ${code} bertentangan langsung dengan ${conflictingCode} pada target ${item.target}.`,
              options: [
                { id: 'keep_a', label: `Gunakan ${code}` },
                { id: 'keep_b', label: `Gunakan ${conflictingCode}` }
              ]
            };
            conflictItem.suggestion = this.generateConflictSuggestion(conflictItem, item, conflictingItem);
            conflicts.push(conflictItem);
          }
        }
      }
    }

    return conflicts;
  }

  /**
   * Menghasilkan saran resolusi cerdas dan kontekstual untuk setiap pertentangan direktif
   */
  generateConflictSuggestion(conflict, itemA = null, itemB = null) {
    const codeA = (conflict.shorthandA || '').toLowerCase();
    const codeB = (conflict.shorthandB || '').toLowerCase();
    const pair = [codeA, codeB].sort().join(' vs ');

    // 1. Kasus Latar Belakang (BACKGROUND)
    if (pair === '/backgroundlock vs /bgblur' || (codeA === '/backgroundlock' && codeB === '/bgblur') || (codeB === '/backgroundlock' && codeA === '/bgblur')) {
      return 'Tentukan prioritas latar belakang: Jika ingin efek kedalaman optik (bokeh/buram lembut) agar subjek di depan lebih menonjol, pilih /bgblur dan lepaskan /backgroundlock. Namun jika lingkungan asli wajib dipertahankan utuh tanpa sentuhan blur, pertahankan /backgroundlock dan batalkan /bgblur.';
    }
    if (pair === '/backgroundlock vs /studiobg' || (codeA === '/backgroundlock' && codeB === '/studiobg') || (codeB === '/backgroundlock' && codeA === '/studiobg')) {
      return 'Tentukan prioritas latar belakang: Jika ingin mengganti latar menjadi backdrop studio foto profesional dengan pencahayaan terkontrol, pilih /studiobg dan lepaskan /backgroundlock. Sebaliknya, jika latar tempat foto asli harus dipertahankan 100%, pertahankan /backgroundlock.';
    }
    if (pair === '/backgroundlock vs /bgreplace' || (codeA === '/backgroundlock' && codeB === '/bgreplace') || (codeB === '/backgroundlock' && codeA === '/bgreplace')) {
      return 'Tentukan prioritas latar belakang: Jika ingin mengganti latar dengan lokasi atau pemandangan baru, pilih /bgreplace dan lepaskan /backgroundlock. Pertahankan /backgroundlock jika lokasi asli tidak boleh diganti.';
    }
    if (pair === '/backgroundlock vs /bgremove' || (codeA === '/backgroundlock' && codeB === '/bgremove') || (codeB === '/backgroundlock' && codeA === '/bgremove')) {
      return 'Tentukan prioritas latar belakang: Jika ingin mengisolasi subjek tanpa latar belakang (transparan murni untuk cutout/stiker/katalog), pilih /bgremove dan lepaskan /backgroundlock. Jika latar asli tetap dibutuhkan, pertahankan /backgroundlock.';
    }

    // Konflik sesama direktif ubah latar
    if (pair === '/bgremove vs /bgreplace' || (codeA === '/bgreplace' && codeB === '/bgremove') || (codeA === '/bgremove' && codeB === '/bgreplace')) {
      return 'Pilih hasil akhir latar belakang: Gunakan /bgremove jika ingin hasil potongan transparan murni (matte alpha channel tanpa latar), atau gunakan /bgreplace jika ingin mengganti latar belakang dengan pemandangan/lokasi baru. Kedua direktif ini saling meniadakan.';
    }
    if (pair === '/bgblur vs /bgremove' || (codeA === '/bgblur' && codeB === '/bgremove') || (codeA === '/bgremove' && codeB === '/bgblur')) {
      return 'Pilih efek latar: Efek blur (/bgblur) tidak dapat diterapkan jika latar belakang dihapus transparan (/bgremove). Gunakan /bgremove untuk subjek terpotong transparan, atau /bgblur untuk mempertahankan latar dengan blur lembut.';
    }
    if (pair === '/bgremove vs /studiobg' || (codeA === '/studiobg' && codeB === '/bgremove') || (codeA === '/bgremove' && codeB === '/studiobg')) {
      return 'Pilih jenis latar: Gunakan /studiobg jika ingin subjek berada di latar belakang studio foto, atau gunakan /bgremove jika membutuhkan subjek terisolasi tanpa latar (transparan PNG).';
    }
    if (pair === '/bgblur vs /studiobg' || (codeA === '/studiobg' && codeB === '/bgblur') || (codeA === '/bgblur' && codeB === '/studiobg')) {
      return 'Pilih salah satu: Latar studio (/studiobg) umumnya sudah bersih dan seragam. Jika menginginkan efek bokeh ekstra dramatis, pertahankan /bgblur, namun jika ingin pencahayaan studio standar, cukup gunakan /studiobg.';
    }

    // 2. Kasus Wajah & Identitas (FACE_IDENTITY)
    if (codeA === '/facelock' || codeB === '/facelock') {
      const otherCode = codeA === '/facelock' ? codeB : codeA;
      return `Tentukan prioritas wajah: Jika identitas wajah dan fitur asli harus persis sama (100% konsisten), pertahankan /facelock dan batalkan ${otherCode}. Jika instruksi Anda sengaja ingin merombak ekspresi, bentuk, atau fitur muka baru, lepaskan /facelock dan gunakan ${otherCode}.`;
    }

    // 3. Kasus Busana / Pakaian (OUTFIT)
    if (codeA === '/outfitlock' || codeB === '/outfitlock') {
      const otherCode = codeA === '/outfitlock' ? codeB : codeA;
      return `Tentukan prioritas pakaian: Pertahankan /outfitlock jika busana asli subjek wajib dilindungi dari perubahan. Jika ingin mengenakan pakaian atau kostum baru, lepaskan /outfitlock dan terapkan ${otherCode}.`;
    }

    // 4. Kasus Rambut (HAIR)
    if (codeA === '/hairlock' || codeB === '/hairlock') {
      const otherCode = codeA === '/hairlock' ? codeB : codeA;
      return `Tentukan prioritas rambut: Pertahankan /hairlock jika model dan helai rambut asli tidak boleh berubah. Jika ingin mengubah model potongan, warna, atau tekstur rambut, lepaskan /hairlock dan gunakan ${otherCode}.`;
    }

    // 5. Kasus Penutup Kepala / Hijab (HEADWEAR)
    if (codeA === '/headwearlock' || codeB === '/headwearlock') {
      const otherCode = codeA === '/headwearlock' ? codeB : codeA;
      return `Tentukan prioritas penutup kepala: Pertahankan /headwearlock jika hijab/aksesori kepala asli harus tetap terpasang. Gunakan ${otherCode} jika ingin melepas atau mengganti penutup kepala.`;
    }

    // 6. Kasus Bentuk Tubuh & Postur (BODY_POSE)
    if (codeA === '/bodylock' || codeB === '/bodylock') {
      const otherCode = codeA === '/bodylock' ? codeB : codeA;
      return `Tentukan prioritas tubuh: Pertahankan /bodylock jika proporsi dan postur tubuh asli tidak boleh diubah. Jika ingin menyesuaikan bentuk kurva atau siluet tubuh, lepaskan /bodylock dan terapkan ${otherCode}.`;
    }

    // 7. Kasus Gaya Visual & Warna (STYLE / COLOR)
    if (pair === '/cinematic vs /rawphoto' || (codeA === '/cinematic' && codeB === '/rawphoto') || (codeA === '/rawphoto' && codeB === '/cinematic')) {
      return 'Pilih gaya visual utama: Gunakan /rawphoto untuk hasil foto mentah autentik khas sensor kamera nyata tanpa filter, atau gunakan /cinematic untuk pencahayaan dramatis dan palet warna berkelas layar lebar.';
    }
    if (pair === '/rawphoto vs /vintage' || (codeA === '/vintage' && codeB === '/rawphoto') || (codeA === '/rawphoto' && codeB === '/vintage')) {
      return 'Pilih tekstur visual: Gunakan /rawphoto untuk ketajaman optik kamera digital modern, atau gunakan /vintage untuk nuansa analog film 35mm dengan grain klasik.';
    }
    if (pair === '/cooltone vs /warmtone' || (codeA === '/warmtone' && codeB === '/cooltone') || (codeA === '/cooltone' && codeB === '/warmtone')) {
      return 'Tentukan temperatur warna: Pilih /warmtone untuk kesan hangat keemasan yang bersahabat, atau /cooltone untuk atmosfer dingin kebiruan yang modern dan tajam.';
    }
    if (codeA === '/monochrome' || codeB === '/monochrome') {
      const otherCode = codeA === '/monochrome' ? codeB : codeA;
      return `Tentukan mode warna: Gunakan /monochrome jika menginginkan seni foto hitam-putih monokromatik murni, atau pilih ${otherCode} jika gambar harus tampil berwarna.`;
    }
    if (pair === '/bokeh vs /sharpen' || (codeA === '/sharpen' && codeB === '/bokeh') || (codeA === '/bokeh' && codeB === '/sharpen')) {
      return 'Tentukan fokus ketajaman: Pilih /bokeh jika menginginkan kedalaman bidang dangkal dengan blur artistik, atau pilih /sharpen jika ingin mikrotekstur tajam merata di seluruh gambar.';
    }

    // 8. Fallback umum EDIT_VS_LOCK
    if (conflict.type === 'EDIT_VS_LOCK') {
      const lockCode = conflict.shorthandA;
      const label = conflict.label || conflict.entity || 'area ini';
      return `Tentukan prioritas pada ${label}: Jika modifikasi baru memang diinginkan, lepaskan kunci (${lockCode}) dan gunakan instruksi ubah. Namun jika tampilan asli wajib dilindungi 100%, pertahankan kunci (${lockCode}) dan batalkan instruksi ubah.`;
    }

    // 9. Fallback umum SHORTHAND_CLASH
    const targetName = conflict.entity || 'target yang sama';
    return `Kedua shorthand (${conflict.shorthandA} dan ${conflict.shorthandB}) memiliki instruksi yang saling meniadakan pada ${targetName}. Disarankan memilih salah satu yang paling mewakili visi visual utama Anda agar AI tidak menghasilkan output yang rancu.`;
  }

  evaluateExclusions(recommendations, primaryShorthands = []) {
    const recCodes = new Set(recommendations.map(r => r.code));
    for (const r of recommendations) {
      if (r.equivalentTo) {
        for (const eq of r.equivalentTo) recCodes.add(eq);
      }
    }

    const primaryCodes = new Set(primaryShorthands.map(p => p.code));

    const exclusions = [];
    for (const item of this.catalog) {
      if (recCodes.has(item.code)) continue;

      let exclusionReason = 'Tidak ada instruksi yang relevan dengan fungsi shorthand ini pada prompt user.';

      // Check for conflict with an active primary shorthand
      const conflictingPrimary = primaryShorthands.find(p => {
        if (item.conflicts && item.conflicts.includes(p.code)) return true;
        if (p.item?.conflicts && p.item.conflicts.includes(item.code)) return true;
        return false;
      });

      if (conflictingPrimary) {
        exclusionReason = `Bertentangan dengan direktif aktif: ${conflictingPrimary.code} (${conflictingPrimary.name}).`;
      } else if (item.category === 'LOCK_PRESERVATION' || item.category === 'FACE_IDENTITY') {
        if (item.code === '/facelock' || item.code === '/faceedit' || item.code === '/facechange') {
          exclusionReason = 'Tidak ada instruksi yang menyentuh atau mengunci area wajah.';
        } else if (item.code === '/hairlock') {
          exclusionReason = 'Tidak ada instruksi yang memodifikasi atau mengunci rambut subjek.';
        } else if (item.code === '/backgroundlock') {
          exclusionReason = 'Latar belakang tidak diminta untuk dikunci secara eksplisit.';
        } else if (item.code === '/outfitlock') {
          exclusionReason = 'Pakaian subjek tidak diminta untuk dikunci.';
        } else if (item.code === '/headwearlock') {
          exclusionReason = 'Tidak ada instruksi penutup kepala atau hijab untuk dikunci.';
        }
      } else if (item.category === 'HAIR') {
        exclusionReason = 'Tidak ada instruksi yang mengubah gaya atau warna rambut subjek.';
      } else if (item.category === 'OUTFIT') {
        if (primaryCodes.has('/outfit')) {
          if (item.code === '/outfit-remove') {
            exclusionReason = 'Instruksi adalah mengganti busana (/outfit), bukan menanggalkan busana.';
          } else if (item.code === '/outfit-color') {
            exclusionReason = 'Instruksi mengganti model busana baru (/outfit), bukan hanya mengubah warna busana lama.';
          } else {
            exclusionReason = 'Fungsi modifikasi pakaian sudah diwakili oleh direktif /outfit.';
          }
        } else {
          exclusionReason = 'Tidak ada instruksi yang memodifikasi pakaian atau busana.';
        }
      } else if (item.category === 'HEADWEAR') {
        exclusionReason = 'Tidak ada instruksi penutup kepala atau hijab.';
      } else if (item.category === 'BACKGROUND' || item.category === 'TRANSPARENCY') {
        if (item.code === '/bgremove') {
          exclusionReason = 'Tidak ada permintaan penghapusan latar belakang menjadi transparan.';
        } else if (item.code === '/bgreplace') {
          exclusionReason = 'Tidak ada permintaan penggantian latar belakang ke scene baru.';
        } else {
          exclusionReason = 'Tidak ada permintaan manipulasi latar belakang.';
        }
      } else if (item.category === 'CANVAS_RATIO') {
        exclusionReason = 'Tidak ada instruksi pengubahan rasio kanvas gambar.';
      } else if (item.category === 'BODY_POSE') {
        exclusionReason = 'Tidak ada permintaan perubahan pose atau framing seluruh badan.';
      } else if (item.category === 'STYLE_EFFECT' || item.category === 'CAMERA_PHOTO') {
        exclusionReason = 'Gaya artistik atau karakter kamera khusus tidak dispesifikasikan.';
      } else if (item.category === 'EXPRESSION') {
        exclusionReason = 'Tidak ada instruksi perubahan ekspresi atau emosi wajah.';
      } else if (item.category === 'OBJECT') {
        exclusionReason = 'Tidak ada instruksi penambahan atau penghapusan objek pada adegan.';
      }

      exclusions.push({
        code: item.code,
        name: item.name,
        category: item.category,
        target: item.target,
        description: item.description,
        reason: exclusionReason
      });
    }

    return exclusions;
  }

  generateVisualTransformation(editAreas, lockedAreas, cleanPrompt) {
    if (editAreas.length === 0 && lockedAreas.length === 0) {
      return {
        from: 'Kondisi visual awal gambar sebelum diproses',
        to: cleanPrompt || 'Belum ada transformasi yang diterapkan',
        summary: 'Tidak ada modifikasi visual signifikan yang terdeteksi.'
      };
    }

    const editSummaries = editAreas.map(e => e.label).join(', ');
    const lockSummaries = lockedAreas.map(l => l.label).join(', ');

    let fromText = 'Elemen visual awal gambar';
    let toText = 'Elemen visual teroptimasi';

    if (editAreas.some(e => e.entity === 'LIGHTING')) {
      fromText = 'Pencahayaan awal (mungkin kurang seimbang, redup, atau flat)';
      toText = 'Pencahayaan yang diperbaiki, seimbang, dan dioptimalkan secara menyeluruh';
    } else if (editAreas.some(e => e.entity === 'HEADWEAR')) {
      fromText = 'Subjek mengenakan penutup kepala / hijab asli';
      toText = 'Penutup kepala dilepas dengan rekonstruksi rambut alami; ' + (lockSummaries ? `wajah & identitas tetap 100% konsisten.` : '');
    } else if (editAreas.some(e => e.entity === 'OUTFIT')) {
      const outfitEdit = editAreas.find(e => e.entity === 'OUTFIT');
      fromText = 'Busana awal subjek';
      toText = `${outfitEdit ? outfitEdit.description : 'Busana baru terpasang'}` + (lockSummaries ? `; ${lockSummaries} tetap terkunci aman.` : '');
    } else if (editAreas.some(e => e.entity === 'BACKGROUND' && e.action.includes('REMOVE'))) {
      fromText = 'Foto subjek dengan latar belakang bawaan';
      toText = 'Subjek terisolasi rapi dengan latar belakang transparan (alpha channel)';
    } else if (editAreas.some(e => e.entity === 'BACKGROUND' && e.action.includes('REPLACE'))) {
      fromText = 'Latar belakang awal foto';
      toText = 'Latar belakang digantikan dengan pemandangan baru yang harmonis';
    } else if (editAreas.some(e => e.entity === 'CANVAS_RATIO')) {
      const canvasEdit = editAreas.find(e => e.entity === 'CANVAS_RATIO');
      fromText = 'Dimensi kanvas bawaan foto';
      toText = `${canvasEdit ? canvasEdit.description : 'Dimensi kanvas baru disesuaikan'}`;
    }

    return {
      from: fromText,
      to: toText,
      summary: `Transformasi pada [${editSummaries || 'Tanpa Edit'}] dengan preservasi pada [${lockSummaries || 'Elemen Lain'}].`
    };
  }

  buildOptimalPrompt(cleanText, installedShorthands) {
    if (!cleanText && installedShorthands.length === 0) {
      return '';
    }

    let base = cleanText.trim();
    if (base && !base.endsWith('.') && !base.endsWith('!') && !base.endsWith('?')) {
      base += '.';
    }

    // Append installed shorthands
    const shorthandsString = installedShorthands.join(' ');
    if (base && shorthandsString) {
      return `${base} ${shorthandsString}`;
    } else if (shorthandsString) {
      return shorthandsString;
    }
    return base;
  }

  getEmptyResult() {
    return {
      rawPrompt: '',
      normalizedPrompt: '',
      cleanText: '',
      intent: {
        primaryAction: '-',
        primaryTarget: '-',
        summary: 'Prompt belum dianalisis. Masukkan prompt di atas untuk memulai.',
        priority: '-',
        category: '-'
      },
      editAreas: [],
      lockedAreas: [],
      unchangedAreas: [],
      conflicts: [],
      primaryShorthands: [],
      relatedShorthands: [],
      recommendations: [],
      exclusions: [],
      installedShorthands: [],
      visualTransformation: {
        from: '-',
        to: '-',
        summary: '-'
      },
      optimalPrompt: '',
      timestamp: null
    };
  }
}
