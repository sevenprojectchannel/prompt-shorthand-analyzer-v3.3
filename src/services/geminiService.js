/**
 * Centralized Gemini Service V2
 * 
 * Prinsip:
 * 1. SATU titik akses terpusat untuk seluruh interaksi Gemini API.
 * 2. 100% BYOK (Bring Your Own Key) - tidak ada API key developer yang di-hardcode.
 * 3. Graceful Fallback: Jika key kosong, offline, atau gagal, aplikasi beralih
 *    mulus ke Local Semantic Engine tanpa crash.
 */

import { StorageService } from './storageService.js';
import { SemanticEngine } from '../lib/semanticEngine.js';

export const GEMINI_STATUS = {
  CONNECTED: 'CONNECTED',     // 🟢 Tersambung
  UNCONFIGURED: 'UNCONFIGURED', // 🟡 Belum diuji / konfigurasi
  FAILED: 'FAILED'            // 🔴 Gagal
};

export class GeminiService {
  constructor(catalog = []) {
    this.catalog = catalog;
    this.localEngine = new SemanticEngine(catalog);
    this.status = GEMINI_STATUS.UNCONFIGURED;
    this.lastError = null;
    this.initStatusFromStorage();
  }

  setCatalog(catalog) {
    this.catalog = catalog;
    this.localEngine.setCatalog(catalog);
  }

  initStatusFromStorage() {
    const key = StorageService.getApiKey();
    if (!key) {
      this.status = GEMINI_STATUS.UNCONFIGURED;
    }
  }

  getStatus() {
    return {
      status: this.status,
      error: this.lastError,
      hasKey: Boolean(StorageService.getApiKey())
    };
  }

  /**
   * Helper: Parse JSON with multi-stage fallback and markdown fence stripping
   */
  extractJson(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Respon kosong dari AI.');
    }

    // 1. Direct JSON parse
    try {
      return JSON.parse(rawText.trim());
    } catch (_) {}

    // 2. Strip markdown code fences (```json ... ``` or ``` ... ```)
    let cleaned = rawText
      .replace(/```(?:json)?/gi, '')
      .replace(/```/g, '')
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch (_) {}

    // 3. Find outermost JSON object { ... }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
      const candidateObj = cleaned.substring(firstBrace, lastBrace + 1);
      try {
        return JSON.parse(candidateObj);
      } catch (_) {}
    }

    // 4. Find outermost JSON array [ ... ]
    const firstBracket = cleaned.indexOf('[');
    const lastBracket = cleaned.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket > firstBracket) {
      const candidateArr = cleaned.substring(firstBracket, lastBracket + 1);
      try {
        return JSON.parse(candidateArr);
      } catch (_) {}
    }

    throw new Error('Gagal mem-parsing format JSON dari respons AI.');
  }

  /**
   * Test connection using the user's API Key with multi-model cascade
   */
  async testConnection(apiKey, modelName) {
    const key = (apiKey || StorageService.getApiKey()).trim();
    const preferredModel = modelName || StorageService.getModel() || 'gemini-2.0-flash';

    if (!key) {
      this.status = GEMINI_STATUS.UNCONFIGURED;
      this.lastError = 'API Key belum dimasukkan';
      return {
        success: false,
        status: GEMINI_STATUS.UNCONFIGURED,
        message: 'Masukkan Gemini API Key Anda terlebih dahulu.'
      };
    }

    const candidateModels = [
      preferredModel,
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i);

    let lastErrMsg = '';
    let connectedModel = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}?key=${encodeURIComponent(key)}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          connectedModel = model;
          break;
        } else {
          const errorData = await response.json().catch(() => ({}));
          lastErrMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
          if (response.status === 404) {
            // Model not found on this tier/API version, try next candidate
            continue;
          }
          if (response.status === 400 || response.status === 403) {
            // Invalid API key or permission denied
            break;
          }
        }
      } catch (err) {
        lastErrMsg = err.message || 'Koneksi jaringan gagal';
      }
    }

    if (connectedModel) {
      this.status = GEMINI_STATUS.CONNECTED;
      this.lastError = null;
      if (connectedModel !== preferredModel) {
        StorageService.setModel(connectedModel);
      }
      return {
        success: true,
        status: GEMINI_STATUS.CONNECTED,
        message: `Berhasil terhubung ke model ${connectedModel}!`
      };
    }

    // Secondary check: query available models list with user's key
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
      const listResp = await fetch(listUrl);
      if (listResp.ok) {
        const listData = await listResp.json().catch(() => ({}));
        const available = (listData.models || []).find(m => m.supportedGenerationMethods?.includes('generateContent'));
        if (available) {
          const autoModel = available.name.replace(/^models\//, '');
          StorageService.setModel(autoModel);
          this.status = GEMINI_STATUS.CONNECTED;
          this.lastError = null;
          return {
            success: true,
            status: GEMINI_STATUS.CONNECTED,
            message: `Berhasil terhubung ke Gemini API (Model: ${autoModel})!`
          };
        }
      }
    } catch {
      // ignore
    }

    this.status = GEMINI_STATUS.FAILED;
    this.lastError = lastErrMsg || 'Koneksi gagal';
    return {
      success: false,
      status: GEMINI_STATUS.FAILED,
      message: `Gagal tersambung ke Gemini: ${this.lastError}`
    };
  }

  /**
   * Analyze prompt: Calls Gemini API if configured & connected;
   * otherwise transparently falls back to local SemanticEngine.
   */
  async analyzePrompt(rawPrompt, installedOverrides = null) {
    const key = StorageService.getApiKey().trim();
    const model = StorageService.getModel() || 'gemini-2.0-flash';

    // If no key or not connected, immediately use local engine
    if (!key) {
      const localResult = this.localEngine.analyze(rawPrompt, installedOverrides);
      return {
        ...localResult,
        source: 'LOCAL_ENGINE',
        isOnlineActive: false,
        engineNotice: 'Pencarian Online Shorthand TIDAK AKTIF (Mode Heuristik Lokal — Hubungkan Gemini API Key di Pengaturan untuk mengaktifkan pencarian online tanpa batas).'
      };
    }

    try {
      const aiResult = await this.callGeminiAPI(rawPrompt, key, model);
      if (aiResult) {
        // Merge AI structured result with shorthand catalog
        const finalResult = this.mergeAiWithCatalog(aiResult, rawPrompt, installedOverrides);
        this.status = GEMINI_STATUS.CONNECTED;
        this.lastError = null;
        const activeModel = StorageService.getModel() || model;
        return {
          ...finalResult,
          source: 'GEMINI_AI',
          isOnlineActive: true,
          engineNotice: `🌐 Pencarian Online Shorthand AKTIF (${activeModel}) — Menganalisis seluruh isi prompt tanpa batas domain, topik, atau kategori.`
        };
      }
    } catch (err) {
      console.warn('Gemini API call failed, maintaining connection and falling back smoothly to local engine:', err);
      // PENTING: JANGAN memutuskan status koneksi ke FAILED hanya karena sebuah prompt atau model error!
      // Status koneksi tetap CONNECTED karena API Key valid, hanya request individual ini yang fallback.
      this.lastError = err.message;
    }

    // Fallback to local deterministic engine without disconnecting Gemini
    const localResult = this.localEngine.analyze(rawPrompt, installedOverrides);
    return {
      ...localResult,
      source: 'LOCAL_ENGINE_FALLBACK',
      isOnlineActive: true,
      engineNotice: `🌐 Pencarian Online Shorthand AKTIF (Fallback lokal sementara: ${this.lastError || 'timeout/limit'}). Koneksi tetap tersambung.`
    };
  }

  /**
   * Call Gemini generateContent with multi-model fallback cascade
   */
  async callGeminiAPI(prompt, apiKey, model) {
    const candidateModels = [
      model,
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i);

    let lastError = null;

    for (const currentModel of candidateModels) {
      try {
        const result = await this.executeGenerateContent(prompt, apiKey, currentModel);
        if (result) {
          if (currentModel !== model) {
            StorageService.setModel(currentModel);
          }
          return result;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Model ${currentModel} tidak dapat digunakan (${err.message}), mencoba model alternatif...`);
        continue;
      }
    }

    throw lastError || new Error('Semua model Gemini tidak dapat dijangkau.');
  }

  /**
   * Private: Execute single generateContent request and parse JSON safely
   */
  async executeGenerateContent(prompt, apiKey, model) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const systemInstruction = `Anda adalah Prompt Shorthand Analyzer V3.1 dengan Fitur Pencarian Online Shorthand Terbuka & Tidak Terbatas.
Tugas Anda: Menganalisis SELURUH isi INPUT PROMPT pengguna secara semantik dan menemukan/merekomendasikan notasi visual shorthand AI yang paling tepat, profesional, dan relevan.

PRINSIP UTAMA: PENCARIAN SHORTHAND HARUS TERBUKA DAN TIDAK TERBATAS.
- JANGAN MEMBATASI pencarian hanya pada kategori, subkategori, daftar istilah, atau topik tertentu.
- SETIAP INPUT PENGGUNA HARUS DAPAT DIPROSES DAN DICARI, apa pun topik, objek, gaya seni, konsep visual, komposisi, rasio/perluasan kanvas (outpainting / uncrop / expand canvas), aktivitas, profesi, suasana, atau istilah baru yang digunakan.
- Analisis seluruh makna dan konteks prompt, bukan hanya pencocokan kata kaku.
- Tetap temukan shorthand untuk istilah atau konsep baru yang belum terdapat dalam daftar shorthand lokal.
- Tidak memberikan batasan pencarian berdasarkan kategori aset.
- Tidak memblokir pencarian hanya karena istilah tidak dikenal oleh katalog shorthand lokal.
- Tampilkan HANYA shorthand yang benar-benar relevan dengan fungsi atau konsep dalam prompt.

PANDUAN SHORTHAND & NOTASI VISUAL:
1. Awali setiap shorthand dengan garis miring "/" (contoh: /outpaint, /expandcanvas, /facelock, /hairlock, /curvy, /enhance, /sharpen, /cyberpunk, /surgeon, /macrolens, /bokeh, dsb.).
2. Jika konsep ada di katalog umum aplikasi (misal: /facelock, /hairlock, /backgroundlock, /outfitlock, /bodylock, /outfit, /bgremove, /bgreplace, /headwear-remove, /enhance, /sharpen, /highresolution, /ar 9:16, /ar 16:9, /ar 1:1, /fullbody, /cinematic, /rawphoto, /colorgrade, /bodyvoluptuous, /curvy, /fullfigured, /plussize, /voluptuous, /handperfect, /hands, /handanatomy, /fingerperfect, /handdetail, /handnatural, /outpaint), prioritaskan kode tersebut.
3. JIKA user memasukkan kata kunci / konsep baru di luar katalog dasar (contoh: "memperluas foto" -> /outpaint, "fotografer tokyo cyberpunk" -> /cyberpunk, "dokter bedah" -> /surgeon, "lensa makro" -> /macrolens, dsb.), Anda WAJIB membuat dan merekomendasikan notasi shorthand yang paling profesional, presisi, dan sesuai standar industri visual AI.
4. Struktur Rekomendasi:
   - primaryShorthands (Prioritas 'WAJIB', isPrimary: true, checked: true): Rekomendasi utama (1 atau 2 shorthand paling vital yang langsung terpasang di Prompt Optimal). Beri label source: "ONLINE".
   - relatedShorthands (Prioritas 'DISARANKAN', isPrimary: false, checked: false): Alternatif shorthand relevan lainnya (2 sampai 5 pilihan alternatif). Beri label source: "ONLINE".

Jawab HANYA dalam format JSON valid tanpa markdown formatting:
{
  "intent": {
    "primaryAction": "NAMA_AKSI_SEMANTIK",
    "primaryTarget": "Target visual",
    "summary": "Ringkasan maksud instruksi visual user dalam bahasa Indonesia",
    "priority": "HIGH" | "MEDIUM" | "LOW",
    "category": "BODY_POSE" | "FACE_IDENTITY" | "HAIR" | "HEADWEAR" | "OUTFIT" | "BACKGROUND" | "LIGHTING" | "IMAGE_QUALITY" | "COLOR_TONE" | "CANVAS_RATIO" | "TRANSPARENCY" | "OBJECT_EDITING" | "STYLE_EFFECT" | "CAMERA_PHOTO"
  },
  "editAreas": [
    {
      "entity": "KATEGORI_ENTITY",
      "label": "Nama Area",
      "action": "ACTION_CODE",
      "description": "Deskripsi perubahan",
      "shorthand": "/shorthandutama"
    }
  ],
  "lockedAreas": [],
  "primaryShorthands": [
    {
      "code": "/shorthandutama",
      "name": "Nama Shorthand Utama",
      "category": "KATEGORI",
      "target": "TARGET",
      "description": "Penjelasan fungsi shorthand utama",
      "priority": "WAJIB",
      "reason": "Alasan rekomendasi utama",
      "isPrimary": true,
      "checked": true
    }
  ],
  "relatedShorthands": [
    {
      "code": "/alternatif1",
      "name": "Nama Alternatif",
      "category": "KATEGORI",
      "target": "TARGET",
      "description": "Penjelasan fungsi alternatif",
      "priority": "DISARANKAN",
      "reason": "Alternatif untuk variasi kebutuhan",
      "isPrimary": false,
      "checked": false
    }
  ],
  "installedShorthands": ["/shorthandutama"],
  "optimalPrompt": "prompt user bersih. /shorthandutama",
  "visualTransformation": "Deskripsi efek visual yang terjadi pada gambar"
}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemInstruction}\n\nPrompt User: "${prompt}"`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Respon Gemini kosong.');

    return this.extractJson(rawText);
  }

  /**
   * Ensure AI response enriches catalog and seamlessly provides recommendations
   */
  mergeAiWithCatalog(aiResult, rawPrompt, installedOverrides) {
    const fallback = this.localEngine.analyze(rawPrompt, installedOverrides);

    // 1. Tentukan primaryShorthands (Prioritaskan hasil online AI saat aktif)
    let primaryShorthands = [];
    const primaryCodesSet = new Set();

    if (aiResult && Array.isArray(aiResult.primaryShorthands) && aiResult.primaryShorthands.length > 0) {
      for (const p of aiResult.primaryShorthands) {
        if (!p || !p.code) continue;
        const code = p.code.startsWith('/') ? p.code : `/${p.code}`;
        if (primaryCodesSet.has(code)) continue;
        primaryCodesSet.add(code);

        // Cari metadata di katalog lokal jika ada
        const catItem = this.catalog.find(c => c.code.toLowerCase() === code.toLowerCase());
        primaryShorthands.push({
          item: catItem || null,
          code,
          name: p.name || catItem?.name || code,
          category: p.category || catItem?.category || 'ONLINE_DISCOVERY',
          target: p.target || catItem?.target || 'Konsep Visual Prompt',
          description: p.description || catItem?.description || 'Instruksi visual shorthand hasil analisis semantik online.',
          priority: 'WAJIB',
          reason: p.reason || 'Shorthand utama relevan berdasarkan analisis konteks prompt online.',
          isPrimary: true,
          checked: true,
          source: catItem ? 'CORE' : 'ONLINE',
          isOnline: !catItem,
          equivalentTo: catItem?.equivalentTo || p.equivalentTo || [],
          functionGroup: catItem?.functionGroup || p.functionGroup || p.category || 'ONLINE_EXTENSION'
        });
      }

      // Pastikan lock eksplisit dari user (seperti /facelock dari "jangan ubah wajah") tidak hilang
      if (fallback.primaryShorthands && fallback.primaryShorthands.length > 0) {
        for (const fp of fallback.primaryShorthands) {
          if (fp.category === 'LOCK_PRESERVATION' && !primaryCodesSet.has(fp.code)) {
            primaryCodesSet.add(fp.code);
            primaryShorthands.push({
              ...fp,
              isPrimary: true,
              checked: true,
              priority: 'WAJIB'
            });
          }
        }
      }
    } else if (fallback.primaryShorthands && fallback.primaryShorthands.length > 0) {
      primaryShorthands = fallback.primaryShorthands;
    }

    // 2. Tentukan relatedShorthands
    let relatedShorthands = [];
    const relatedCodesSet = new Set([...primaryShorthands.map(p => p.code)]);

    if (aiResult && Array.isArray(aiResult.relatedShorthands)) {
      for (const rel of aiResult.relatedShorthands) {
        if (!rel || !rel.code) continue;
        const code = rel.code.startsWith('/') ? rel.code : `/${rel.code}`;
        if (relatedCodesSet.has(code)) continue;
        relatedCodesSet.add(code);

        const catItem = this.catalog.find(c => c.code.toLowerCase() === code.toLowerCase());
        relatedShorthands.push({
          item: catItem || null,
          code,
          name: rel.name || catItem?.name || code,
          category: rel.category || catItem?.category || 'ONLINE_DISCOVERY',
          target: rel.target || catItem?.target || 'Variasi Konsep Visual',
          description: rel.description || catItem?.description || 'Alternatif shorthand hasil analisis semantik online.',
          priority: rel.priority || 'DISARANKAN',
          reason: rel.reason || 'Alternatif relevan dari pencarian online.',
          isPrimary: false,
          checked: false,
          source: catItem ? 'CORE' : 'ONLINE',
          isOnline: !catItem,
          equivalentTo: catItem?.equivalentTo || rel.equivalentTo || [],
          functionGroup: catItem?.functionGroup || rel.functionGroup || rel.category || 'ONLINE_EXTENSION'
        });
      }
    }

    // Gabungkan fallback related jika belum ada
    if (fallback.relatedShorthands && fallback.relatedShorthands.length > 0) {
      for (const fr of fallback.relatedShorthands) {
        if (!relatedCodesSet.has(fr.code)) {
          relatedCodesSet.add(fr.code);
          relatedShorthands.push(fr);
        }
      }
    }

    // 3. Tentukan installedShorthands
    let installedShorthands = [];
    if (installedOverrides && Array.isArray(installedOverrides)) {
      installedShorthands = installedOverrides;
    } else if (primaryShorthands.length > 0) {
      installedShorthands = primaryShorthands.map(p => p.code);
    } else if (aiResult.installedShorthands && Array.isArray(aiResult.installedShorthands) && aiResult.installedShorthands.length > 0) {
      installedShorthands = aiResult.installedShorthands.map(c => c.startsWith('/') ? c : `/${c}`);
    } else if (fallback.installedShorthands && fallback.installedShorthands.length > 0) {
      installedShorthands = fallback.installedShorthands;
    }

    // 4. Optimal Prompt
    const cleanText = fallback.cleanText || rawPrompt.trim();
    let optimalPrompt = fallback.optimalPrompt;
    if (installedShorthands.length > 0) {
      optimalPrompt = `${cleanText}. ${installedShorthands.join(' ')}`;
    } else if (aiResult.optimalPrompt && aiResult.optimalPrompt.trim()) {
      optimalPrompt = aiResult.optimalPrompt;
    }

    // 5. Intent
    const intent = {
      primaryAction: (aiResult.intent?.primaryAction && aiResult.intent.primaryAction !== 'MODIFIKASI_VISUAL')
        ? aiResult.intent.primaryAction
        : fallback.intent.primaryAction,
      primaryTarget: (aiResult.intent?.primaryTarget && aiResult.intent.primaryTarget !== 'Gambar')
        ? aiResult.intent.primaryTarget
        : fallback.intent.primaryTarget,
      summary: aiResult.intent?.summary || aiResult.summary || fallback.intent.summary,
      priority: aiResult.intent?.priority || fallback.intent.priority,
      category: (aiResult.intent?.category && aiResult.intent.category !== 'GENERAL')
        ? aiResult.intent.category
        : fallback.intent.category
    };

    // 6. Edit & Locked Areas
    const editAreas = (aiResult.editAreas && Array.isArray(aiResult.editAreas) && aiResult.editAreas.length > 0)
      ? aiResult.editAreas
      : fallback.editAreas;
    const lockedAreas = (aiResult.lockedAreas && Array.isArray(aiResult.lockedAreas) && aiResult.lockedAreas.length > 0)
      ? aiResult.lockedAreas
      : fallback.lockedAreas;

    return {
      rawPrompt,
      normalizedPrompt: fallback.normalizedPrompt,
      cleanText,
      intent,
      editAreas,
      lockedAreas,
      unchangedAreas: fallback.unchangedAreas,
      conflicts: (aiResult.conflicts && aiResult.conflicts.length > 0) ? aiResult.conflicts : fallback.conflicts,
      primaryShorthands,
      relatedShorthands,
      recommendations: [...primaryShorthands, ...relatedShorthands],
      exclusions: fallback.exclusions,
      installedShorthands,
      visualTransformation: aiResult.visualTransformation || fallback.visualTransformation,
      optimalPrompt,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Online Fallback Shorthand Search (BYOK Gemini)
   * Digunakan jika katalog lokal tidak menemukan hasil relevan atau hasil terlalu sedikit.
   */
  async searchOnlineShorthand(query) {
    if (!query || typeof query !== 'string' || !query.trim()) {
      return { results: [], onlineAvailable: false, message: '' };
    }

    const key = StorageService.getApiKey() ? StorageService.getApiKey().trim() : '';
    const preferredModel = StorageService.getModel() || 'gemini-2.0-flash';

    if (!key) {
      return {
        results: [],
        onlineAvailable: false,
        message: 'Shorthand tidak ditemukan di katalog lokal dan pencarian online tidak tersedia (atur Gemini API Key di Pengaturan).'
      };
    }

    const candidateModels = [
      preferredModel,
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i);

    const systemPrompt = `Anda adalah Prompt Shorthand Dictionary Assistant profesional. Berdasarkan kata kunci pencarian user dalam domain visual APAPUN (tangan/jari, pose tubuh, fotografi, pencahayaan, sinematik, busana, anime, 3D render, efek visual, kamera, warna, latar, dsb.), rekomendasikan notasi shorthand visual AI yang paling tepat, umum, atau representatif (misal: untuk tangan natural -> /handperfect, /hands, /handanatomy, /fingerperfect; untuk pencahayaan -> /enhance, /cinematic, /volumetric-lighting; untuk portrait -> /portrait, /dof, /bokeh, dsb.).
Aturan:
1. Rekomendasikan 4 sampai 8 notasi shorthand yang paling relevan dengan kata kunci user.
2. Setiap kode shorthand WAJIB diawali garis miring (misal: /handperfect).
3. Berikan nama yang jelas dan deskripsi fungsi spesifik dalam bahasa Indonesia.
4. Format kembalian HANYA JSON array valid tanpa markdown wrapper:
[
  {
    "code": "/...",
    "name": "...",
    "description": "...",
    "category": "BODY_POSE"
  }
]`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemPrompt}\n\nKata kunci pencarian user: "${query.trim()}"`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: 'application/json'
      }
    };

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        let parsed = [];
        try {
          parsed = this.extractJson(rawText);
        } catch {
          continue;
        }

        if (!Array.isArray(parsed)) {
          continue;
        }

        const validResults = parsed
          .filter(item => item && item.code && typeof item.code === 'string')
          .map(item => ({
            code: item.code.startsWith('/') ? item.code : `/${item.code}`,
            name: item.name || item.code,
            description: item.description || 'Instruksi visual shorthand online',
            category: item.category || 'ONLINE_EXTENDED',
            source: 'ONLINE',
            isOnline: true
          }));

        return {
          results: validResults,
          onlineAvailable: true,
          message: validResults.length === 0 ? 'Tidak ada shorthand online yang cocok.' : ''
        };
      } catch (err) {
        console.warn(`Pencarian online dengan model ${model} gagal:`, err);
        continue;
      }
    }

    return {
      results: [],
      onlineAvailable: false,
      message: 'Pencarian online tidak tersedia saat ini.'
    };
  }

  /**
   * Fitur Baru V3.2: PERKAYA DENGAN AI (Enrich with AI)
   * Memperkaya Prompt Optimal menggunakan Gemini AI tanpa mengubah makna utama prompt.
   * Prinsip: "ENRICH, NOT REPLACE." Prompt Optimal asli adalah SOURCE OF TRUTH.
   */
  async enrichPrompt(optimalPrompt, analysisContext = null) {
    if (!optimalPrompt || typeof optimalPrompt !== 'string' || !optimalPrompt.trim()) {
      throw new Error('Prompt optimal kosong.');
    }

    const key = StorageService.getApiKey() ? StorageService.getApiKey().trim() : '';
    const preferredModel = StorageService.getModel() || 'gemini-2.0-flash';

    if (!key) {
      throw new Error('Gemini API Key belum terhubung. Silakan atur di menu API & Pengaturan.');
    }

    // Ekstrak seluruh shorthand yang ada di Prompt Optimal asli (misal /facelock, /hairlock, /enhance)
    const originalShorthands = (optimalPrompt.match(/\/[a-zA-Z0-9_\-:]+/g) || []);

    const candidateModels = [
      preferredModel,
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-2.5-flash'
    ].filter((m, i, arr) => m && arr.indexOf(m) === i);

    const systemInstruction = `Anda adalah Prompt Shorthand Analyzer V3.3 - Asisten Ahli Prompt Enrichment untuk Generative Visual AI.
Tugas Anda: Memperkaya Prompt Optimal pengguna dengan detail visual berkualitas tinggi tanpa mengubah makna atau maksud utamanya.

PRINSIP UTAMA: "ENRICH, NOT REPLACE" (Prompt Optimal asli adalah SOURCE OF TRUTH).

ATURAN WAJIB & BATASAN KETAT:
1. JANGAN PERNAH mengubah subjek utama, objek utama, aktivitas, konteks, maksud/intent, maupun konsep adegan.
2. JANGAN PERNAH menghapus informasi penting dari Prompt Optimal asli.
3. JANGAN PERNAH menghapus atau mengubah shorthand visual (kata atau kode berawalan '/'). Seluruh shorthand yang ada pada prompt asli WAJIB dipertahankan dan diletakkan di akhir prompt.
4. JANGAN mengubah instruksi identitas, lock, pose, outfit, background, atau constraint penting lainnya.
5. ANDA DIIZINKAN DAN DIANJURKAN MEMPERBAIKI:
   - Kejelasan deskripsi visual dan materialitas objek.
   - Komposisi gambar (framing, focal length, angle kamera jika relevan).
   - Pencahayaan alami atau sinematik (soft illumination, ambient rim light, directional shadow).
   - Atmosfer, kedalaman ruang (depth of field), dan tekstur realistis.
   - Urutan instruksi deskriptif agar optimal dipahami model generasi gambar AI.
6. JANGAN menambahkan detail sembarangan atau fantasi berlebihan hanya agar prompt menjadi panjang.
7. JANGAN mengubah prompt menjadi konsep baru.
8. Pertahankan bahasa utama prompt asli (jika bahasa Inggris tetap bahasa Inggris; jika bahasa Indonesia tetap bahasa Indonesia).

Format respons HANYA berupa JSON valid:
{
  "enrichedPrompt": "teks prompt lengkap yang telah diperkaya beserta seluruh shorthand asli di akhir"
}`;

    const contextSummary = analysisContext?.intent?.summary || '';
    const userPromptPayload = `Prompt Optimal Asli:\n"${optimalPrompt.trim()}"\n${contextSummary ? `Konteks/Maksud Analisis:\n"${contextSummary}"\n` : ''}Shorthand Terpasang Wajib Dipertahankan: ${originalShorthands.length > 0 ? originalShorthands.join(' ') : '(tidak ada)'}`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `${systemInstruction}\n\n${userPromptPayload}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json'
      }
    };

    let lastError = null;

    for (const model of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        const data = await response.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) throw new Error('Respon Gemini kosong.');

        const parsed = this.extractJson(rawText);
        let enrichedText = parsed.enrichedPrompt || parsed.prompt || (typeof parsed === 'string' ? parsed : '');

        if (!enrichedText || typeof enrichedText !== 'string' || !enrichedText.trim()) {
          throw new Error('Hasil pengayaan AI kosong atau tidak valid.');
        }

        enrichedText = enrichedText.trim();

        // Safe preservation: Pastikan seluruh shorthand awal tetap ada
        for (const sh of originalShorthands) {
          if (!enrichedText.includes(sh)) {
            enrichedText += ` ${sh}`;
          }
        }

        return {
          success: true,
          enrichedPrompt: enrichedText,
          modelUsed: model
        };
      } catch (err) {
        lastError = err;
        console.warn(`Enrich prompt dengan model ${model} gagal:`, err.message);
        continue;
      }
    }

    throw lastError || new Error('Gagal memperkaya prompt dengan Gemini.');
  }
}
