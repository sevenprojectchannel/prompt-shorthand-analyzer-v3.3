/**
 * Kamus Shorthand Service (Dictionary Engine)
 * Prompt Shorthand Analyzer V3
 *
 * Prinsip:
 * 1. PRIORITAS 1: Pencarian cepat pada katalog lokal (Core + User Catalog).
 * 2. PRIORITAS 2: Online Fallback jika lokal nihil / minim hasil.
 * 3. Hasil digabungkan dengan urutan: LOCAL dahulu, baru ONLINE.
 * 4. Tidak ada duplikasi shorthand.
 * 5. Ekstraksi salinan murni hanya kode shorthand berspasi.
 */

// Peta sinonim bahasa Indonesia & keyword umum untuk memperkaya pencarian semantik lokal
const LOCAL_KEYWORD_SYNONYMS = {
  wajah: ['face', 'muka', 'identity', 'paras', 'facelock'],
  muka: ['face', 'wajah', 'identity', 'facelock'],
  rambut: ['hair', 'rambut asli', 'natural hair', 'hairlock', 'hairchange', 'gaya rambut'],
  pakaian: ['outfit', 'baju', 'busana', 'pakaian asli', 'outfitlock', 'ganti baju', 'tanktop', 'dress'],
  baju: ['outfit', 'pakaian', 'busana', 'outfitlock', 'ganti baju'],
  pencahayaan: ['lighting', 'light', 'enhance', 'cahaya', 'studio-light', 'hdr'],
  cahaya: ['lighting', 'light', 'enhance', 'pencahayaan'],
  ketajaman: ['sharpen', 'sharp', 'detail', 'clarity', 'tajam'],
  tajam: ['sharpen', 'ketajaman', 'detail'],
  latar: ['background', 'latar belakang', 'bg', 'bgremove', 'bgreplace', 'backgroundlock'],
  background: ['latar', 'latar belakang', 'bg', 'bgremove', 'bgreplace', 'backgroundlock'],
  hijab: ['headwear', 'jilbab', 'kerudung', 'penutup kepala', 'headwear-remove', 'hijaboff'],
  jilbab: ['headwear', 'hijab', 'penutup kepala', 'headwear-remove'],
  tubuh: ['body', 'pose', 'badan', 'bodylock', 'bodyvoluptuous', 'curvy'],
  badan: ['body', 'pose', 'tubuh', 'bodylock', 'bodyvoluptuous', 'curvy'],
  montok: ['bodyvoluptuous', 'voluptuous', 'curvy', 'berisi', 'fullfigured', 'plussize', 'tubuh montok', 'lekuk'],
  berisi: ['bodyvoluptuous', 'fullfigured', 'montok', 'curvy', 'plussize', 'voluptuous', 'tubuh berisi'],
  curvy: ['bodyvoluptuous', 'curvy', 'berlekuk', 'montok', 'voluptuous', 'hourglass'],
  voluptuous: ['bodyvoluptuous', 'voluptuous', 'montok', 'curvy', 'berisi'],
  kamera: ['camera', 'lens', 'lensa', 'angle', 'photo'],
  warna: ['color', 'grade', 'tone', 'colorgrade', 'duotone'],
  rasio: ['aspect ratio', 'ar', 'ukuran', 'canvas', 'ratio'],
  tangan: ['handperfect', 'hands', 'handanatomy', 'handdetail', 'handnatural', 'fingerperfect', 'anatomi tangan', 'hand'],
  jari: ['fingerperfect', 'handperfect', 'handdetail', 'hands', 'anatomi jari', 'finger'],
  anatomi: ['handanatomy', 'handperfect', 'bodylock', 'anatomy'],
  hands: ['handperfect', 'hands', 'handanatomy', 'handdetail', 'tangan'],
  finger: ['fingerperfect', 'handperfect', 'jari'],
  resolusi: ['highresolution', 'superresolution', 'upscale', '4k', '8k', 'highdetail', 'resolusi tinggi'],
  resolution: ['highresolution', 'superresolution', 'upscale', '4k', '8k'],
  kualitas: ['highresolution', 'enhance', 'sharpen', 'rawphoto']
};

export class DictionaryService {
  /**
   * Cari shorthand pada katalog lokal dengan weighted relevance scoring
   */
  static searchLocal(query, catalog = []) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return [];
    }

    const cleanQuery = query.trim().toLowerCase();
    const queryWithoutSlash = cleanQuery.startsWith('/') ? cleanQuery.slice(1) : cleanQuery;
    const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

    // Ambil token sinonim tambahan
    const expandedTokens = new Set(queryTokens);
    for (const token of queryTokens) {
      if (LOCAL_KEYWORD_SYNONYMS[token]) {
        for (const syn of LOCAL_KEYWORD_SYNONYMS[token]) {
          expandedTokens.add(syn.toLowerCase());
        }
      }
    }

    const scored = [];

    for (const item of catalog) {
      if (!item || !item.code) continue;

      let score = 0;
      const codeLower = (item.code || '').toLowerCase();
      const codeClean = codeLower.startsWith('/') ? codeLower.slice(1) : codeLower;
      const nameLower = (item.name || '').toLowerCase();
      const descLower = (item.description || '').toLowerCase();
      const catLower = (item.category || '').toLowerCase();
      const triggers = Array.isArray(item.semanticTriggers)
        ? item.semanticTriggers.map(t => (t || '').toLowerCase())
        : [];
      const whenToUse = (item.whenToUse || '').toLowerCase();

      // 1. Exact match pada code (misal: "/facelock" atau "facelock")
      if (codeLower === cleanQuery || codeClean === queryWithoutSlash) {
        score += 1000;
      } else if (codeClean.startsWith(queryWithoutSlash)) {
        score += 600;
      } else if (codeClean.includes(queryWithoutSlash)) {
        score += 350;
      }

      // 2. Exact match atau contains pada semanticTriggers
      for (const tr of triggers) {
        if (tr === cleanQuery) {
          score += 400;
        } else if (tr.includes(cleanQuery)) {
          score += 250;
        } else {
          // Token matching
          for (const token of expandedTokens) {
            if (token.length > 2 && tr.includes(token)) {
              score += 100;
              break;
            }
          }
        }
      }

      // 3. Match pada name
      if (nameLower === cleanQuery) {
        score += 300;
      } else if (nameLower.includes(cleanQuery)) {
        score += 200;
      } else {
        for (const token of expandedTokens) {
          if (token.length > 2 && nameLower.includes(token)) {
            score += 80;
            break;
          }
        }
      }

      // 4. Match pada description
      if (descLower.includes(cleanQuery)) {
        score += 150;
      } else {
        for (const token of expandedTokens) {
          if (token.length > 2 && descLower.includes(token)) {
            score += 60;
            break;
          }
        }
      }

      // 5. Match pada category atau whenToUse
      if (catLower.includes(cleanQuery)) score += 50;
      if (whenToUse.includes(cleanQuery)) score += 40;

      if (score > 0) {
        scored.push({
          ...item,
          score,
          source: 'LOCAL',
          isOnline: false
        });
      }
    }

    // Urutkan berdasarkan relevansi tertinggi lalu lakukan deduplikasi semantik:
    // Jika terdapat beberapa shorthand dengan fungsi/makna sama, pilih HANYA SATU yang paling relevan
    scored.sort((a, b) => b.score - a.score);
    return this.deduplicateResultsByFunction(scored);
  }

  /**
   * Deduplikasi Semantik:
   * Jika terdapat beberapa shorthand dengan fungsi atau makna yang sama/sangat mirip,
   * jangan tampilkan semuanya; pilih dan tampilkan hanya satu shorthand yang paling relevan.
   */
  static deduplicateResultsByFunction(results = []) {
    if (!results || results.length <= 1) return results;

    const groupMap = new Map();
    const codeToGroup = new Map();

    for (const item of results) {
      if (!item || !item.code) continue;
      const code = item.code.toLowerCase();

      let targetFg = codeToGroup.get(code);

      if (!targetFg) {
        targetFg = item.functionGroup || item.category || code;

        for (const [existingFg, groupItems] of groupMap.entries()) {
          const isEquivalent = groupItems.some(g => {
            const eqList = (g.equivalentTo || []).map(e => (typeof e === 'string' ? e.toLowerCase() : ''));
            return eqList.includes(code);
          });
          if (isEquivalent) {
            targetFg = existingFg;
            break;
          }
        }
      }

      codeToGroup.set(code, targetFg);

      if (Array.isArray(item.equivalentTo)) {
        for (const eq of item.equivalentTo) {
          if (typeof eq === 'string') {
            codeToGroup.set(eq.toLowerCase(), targetFg);
          }
        }
      }

      if (!groupMap.has(targetFg)) {
        groupMap.set(targetFg, [item]);
      } else {
        groupMap.get(targetFg).push(item);
      }
    }

    const deduplicated = [];
    for (const [fg, items] of groupMap.entries()) {
      if (items.length === 1) {
        deduplicated.push(items[0]);
        continue;
      }

      items.sort((a, b) => {
        if (a.preferredRepresentative && !b.preferredRepresentative) return -1;
        if (!a.preferredRepresentative && b.preferredRepresentative) return 1;

        if ((b.score || 0) !== (a.score || 0)) {
          return (b.score || 0) - (a.score || 0);
        }

        const statusWeight = { CORE: 4, APPROVED: 3, CUSTOM: 2, ONLINE: 1 };
        const sA = statusWeight[a.status] || (a.source === 'LOCAL' ? 3 : 1);
        const sB = statusWeight[b.status] || (b.source === 'LOCAL' ? 3 : 1);
        if (sB !== sA) return sB - sA;

        return (a.code || '').length - (b.code || '').length;
      });

      const bestItem = items[0];
      const otherVariants = items.slice(1).map(i => i.code);
      const combinedEquivalents = Array.from(new Set([
        ...(bestItem.equivalentTo || []),
        ...otherVariants
      ]));

      deduplicated.push({
        ...bestItem,
        equivalentTo: combinedEquivalents
      });
    }

    deduplicated.sort((a, b) => (b.score || 0) - (a.score || 0));
    return deduplicated;
  }

  /**
   * Eksekusi alur lengkap: LOCAL SEARCH -> ONLINE FALLBACK jika diperlukan
   */
  static async search(query, catalog = [], geminiService = null) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return {
        query: '',
        results: [],
        localCount: 0,
        onlineCount: 0,
        notice: null
      };
    }

    const trimmed = query.trim();

    // 1. Prioritas 1: Pencarian Lokal
    let localResults = [];
    try {
      localResults = this.searchLocal(trimmed, catalog);
    } catch (err) {
      console.warn('[DictionaryService] Error pencarian lokal:', err);
      localResults = [];
    }

    let onlineResults = [];
    let onlineNotice = null;

    // 2. Prioritas 2: Online Fallback jika hasil lokal minim (< 4) atau tidak ada exact/direct match
    const hasDirectMatch = localResults.some(r => r.score >= 600);
    const needOnlineFallback = localResults.length < 4 || !hasDirectMatch;

    if (needOnlineFallback && geminiService) {
      try {
        const onlineRes = await geminiService.searchOnlineShorthand(trimmed);
        if (onlineRes && Array.isArray(onlineRes.results)) {
          // Cegah duplikasi kode yang sudah ada di lokal
          const existingCodes = new Set(localResults.map(r => r.code.toLowerCase()));
          onlineResults = onlineRes.results.filter(
            r => !existingCodes.has(r.code.toLowerCase())
          );
        }
        if (onlineRes && onlineRes.message && localResults.length === 0) {
          onlineNotice = onlineRes.message;
        }
      } catch (err) {
        console.warn('[DictionaryService] Online fallback error:', err);
      }
    }

    // 3. Gabungkan hasil: LOCAL selalu di atas ONLINE, lalu deduplikasi semantik
    const mergedResults = this.deduplicateResultsByFunction([...localResults, ...onlineResults]);

    let finalNotice = null;
    if (mergedResults.length === 0) {
      finalNotice = onlineNotice || 'Shorthand tidak ditemukan di katalog lokal dan pencarian online tidak tersedia.';
    }

    return {
      query: trimmed,
      results: mergedResults,
      localCount: localResults.length,
      onlineCount: onlineResults.length,
      notice: finalNotice
    };
  }

  /**
   * Format teks untuk copy: hanya kode shorthand yang dipisahkan spasi
   * Contoh: "/facelock /naturalhair /enhance /sharpen"
   */
  static formatSelectedForCopy(selectedShorthands = []) {
    return selectedShorthands
      .map(item => {
        if (!item) return '';
        if (typeof item === 'string') return item.trim();
        return (item.code || '').trim();
      })
      .filter(Boolean)
      .join(' ');
  }
}
