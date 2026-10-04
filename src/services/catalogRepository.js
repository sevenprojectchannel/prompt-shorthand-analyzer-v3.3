/**
 * CatalogRepository V2.1
 * Repository terpusat untuk CORE CATALOG (Read-Only) dan USER CATALOG (IndexedDB Persistent).
 * Mendukung pencarian semantik, function grouping, deduplikasi, ekspor/impor aman (tanpa API key).
 */

import { INITIAL_SHORTHAND_CATALOG, matchShorthandScore } from '../data/catalogData.js';

const DB_NAME = 'psa_v2_catalog_db';
const DB_VERSION = 1;
const STORE_NAME = 'user_shorthands';

export class CatalogRepository {
  constructor(initialCoreCatalog = INITIAL_SHORTHAND_CATALOG) {
    this.coreCatalog = initialCoreCatalog.map(item => ({
      ...item,
      status: item.status || 'CORE',
      source: item.source || 'CORE',
      preferredRepresentative: item.preferredRepresentative !== undefined ? item.preferredRepresentative : true,
      equivalentTo: item.equivalentTo || [],
      relationships: item.relationships || []
    }));

    this.userCatalog = new Map(); // In-memory cache / Node.js fallback
    this.db = null;
    this.isInitialized = false;
  }

  /**
   * Inisialisasi IndexedDB (dengan fallback in-memory jika di lingkungan Node.js/non-browser)
   */
  async init() {
    if (this.isInitialized) return this;

    const hasIndexedDB = typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';
    if (!hasIndexedDB) {
      this.isInitialized = true;
      return this;
    }

    try {
      this.db = await new Promise((resolve, reject) => {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = (e) => {
          const db = e.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'code' });
          }
        };
        req.onsuccess = (e) => resolve(e.target.result);
        req.onerror = (e) => reject(e.target.error);
      });

      // Load existing user entries into memory cache
      await this.loadFromIndexedDB();
    } catch (err) {
      console.warn('IndexedDB unavailable, using memory fallback:', err);
    }

    this.isInitialized = true;
    return this;
  }

  async loadFromIndexedDB() {
    if (!this.db) return;
    try {
      const items = await new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });

      this.userCatalog.clear();
      for (const item of items) {
        if (item && item.code) {
          this.userCatalog.set(item.code, item);
        }
      }
    } catch (err) {
      console.error('Error loading from IndexedDB:', err);
    }
  }

  /**
   * Mengembalikan semua shorthand (CORE + USER aktif)
   */
  getAll(includeDisabled = true) {
    const list = [...this.coreCatalog];
    for (const userItem of this.userCatalog.values()) {
      const existingIdx = list.findIndex(c => c.code === userItem.code);
      if (existingIdx !== -1) {
        // User custom override of core
        list[existingIdx] = { ...list[existingIdx], ...userItem };
      } else {
        list.push(userItem);
      }
    }

    if (!includeDisabled) {
      return list.filter(item => item.status !== 'DISABLED');
    }
    return list;
  }

  /**
   * Pencarian komprehensif pada seluruh metadata:
   * code, name, category, target, description, semanticTriggers, negativeTriggers,
   * functionGroup, relationships, equivalentTo.
   */
  searchShorthands(query, options = {}) {
    const all = this.getAll(options.includeDisabled ?? true);
    if (!query || !query.trim()) return all;

    const q = query.toLowerCase().trim();

    const scored = [];
    for (const item of all) {
      let score = matchShorthandScore(item, q);

      // Extra checks on functionGroup, equivalentTo, relationships
      if (item.functionGroup && item.functionGroup.toLowerCase().includes(q)) {
        score = Math.max(score, 60);
      }
      if (item.equivalentTo && item.equivalentTo.some(eq => eq.toLowerCase().includes(q))) {
        score = Math.max(score, 70);
      }
      if (item.relationships && item.relationships.some(r => r.code?.toLowerCase().includes(q) || r.relationType?.toLowerCase().includes(q))) {
        score = Math.max(score, 45);
      }

      if (score > 0) {
        scored.push({ item, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.item);
  }

  getByCategory(category) {
    if (!category || category === 'ALL') return this.getAll();
    return this.getAll().filter(item => item.category === category);
  }

  getByTarget(target) {
    if (!target || target === 'ALL') return this.getAll();
    return this.getAll().filter(item => item.target === target);
  }

  getByFunctionGroup(functionGroup) {
    if (!functionGroup || functionGroup === 'ALL') return this.getAll();
    return this.getAll().filter(item => item.functionGroup === functionGroup);
  }

  getBySource(source) {
    if (!source || source === 'ALL') return this.getAll();
    return this.getAll().filter(item => item.source === source);
  }

  getByStatus(status) {
    if (!status || status === 'ALL') return this.getAll();
    return this.getAll().filter(item => item.status === status);
  }

  getEquivalent(code) {
    const item = this.getAll().find(c => c.code === code);
    if (!item) return [];
    return item.equivalentTo || [];
  }

  getConflicts(code) {
    const item = this.getAll().find(c => c.code === code);
    if (!item) return [];
    return item.conflicts || [];
  }

  getCompatible(code) {
    const item = this.getAll().find(c => c.code === code);
    if (!item) return [];
    return item.compatibleWith || [];
  }

  getRelated(entityOrCode) {
    const all = this.getAll();
    const item = all.find(c => c.code === entityOrCode || c.target === entityOrCode);
    if (!item || !item.relationships) return [];
    return item.relationships;
  }

  /**
   * Deteksi fungsi serupa jika menambahkan shorthand baru
   */
  detectSimilarFunction(candidate) {
    if (!candidate || !candidate.code) return { hasSimilar: false };

    const all = this.getAll();

    // 1. Exact code clash
    const exactCode = all.find(c => c.code.toLowerCase() === candidate.code.toLowerCase());
    if (exactCode) {
      return {
        hasSimilar: true,
        matchType: 'EXACT_CODE',
        existingItem: exactCode,
        message: `Shorthand dengan kode ${candidate.code} sudah ada di katalog.`
      };
    }

    // 2. Exact functionGroup match
    if (candidate.functionGroup) {
      const matchGroup = all.find(c => c.functionGroup === candidate.functionGroup);
      if (matchGroup) {
        return {
          hasSimilar: true,
          matchType: 'SAME_FUNCTION_GROUP',
          existingItem: matchGroup,
          message: `Fungsi serupa terdeteksi pada group ${candidate.functionGroup} (${matchGroup.code}).`
        };
      }
    }

    // 3. Equivalent alias match
    const aliasMatch = all.find(c => c.equivalentTo && c.equivalentTo.some(eq => eq.toLowerCase() === candidate.code.toLowerCase()));
    if (aliasMatch) {
      return {
        hasSimilar: true,
        matchType: 'ALIAS_OF_EXISTING',
        existingItem: aliasMatch,
        message: `Kode ${candidate.code} sudah terdaftar sebagai alias dari ${aliasMatch.code}.`
      };
    }

    return { hasSimilar: false };
  }

  /**
   * Menambahkan shorthand baru ke User Catalog (IndexedDB)
   */
  async add(entry) {
    if (!entry || !entry.code) {
      throw new Error('Shorthand wajib memiliki kode unik.');
    }

    const item = {
      ...entry,
      status: entry.status || 'CUSTOM',
      source: entry.source || 'USER',
      preferredRepresentative: entry.preferredRepresentative ?? false,
      equivalentTo: entry.equivalentTo || [],
      relationships: entry.relationships || [],
      semanticTriggers: entry.semanticTriggers || [],
      negativeTriggers: entry.negativeTriggers || [],
      conflicts: entry.conflicts || [],
      compatibleWith: entry.compatibleWith || [],
      updatedAt: new Date().toISOString()
    };

    // Save in memory cache
    this.userCatalog.set(item.code, item);

    // Save to IndexedDB if available
    if (this.db) {
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.put(item);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    return item;
  }

  /**
   * Memperbarui shorthand yang ada
   */
  async update(entry) {
    return this.add(entry);
  }

  /**
   * Menghapus shorthand user (Core catalog tidak boleh dihapus)
   */
  async deleteUserEntry(code) {
    const isCore = this.coreCatalog.some(c => c.code === code);
    if (isCore) {
      throw new Error(`Shorthand ${code} merupakan bagian dari CORE CATALOG dan tidak dapat dihapus.`);
    }

    this.userCatalog.delete(code);

    if (this.db) {
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(code);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }

    return true;
  }

  /**
   * Export Catalog:
   * Format:
   * {
   *   "catalogVersion": "2.1",
   *   "exportedAt": "...",
   *   "entries": [...]
   * }
   * TIDAK PERNAH MEMASUKKAN API KEY ATAU KREDENSIAL RAHASIA.
   */
  exportCatalog() {
    const entries = this.getAll().map(item => {
      // Sanitize: ensure no secret fields
      const { apiKey, geminiKey, secret, password, ...safeItem } = item;
      return safeItem;
    });

    return JSON.stringify({
      catalogVersion: '2.1',
      exportedAt: new Date().toISOString(),
      entries
    }, null, 2);
  }

  /**
   * Import Catalog:
   * mode: 'MERGE' (gabungkan tanpa duplikasi) | 'REPLACE' (ganti USER CATALOG saja, CORE tetap aman)
   */
  async importCatalog(jsonStringOrObj, mode = 'MERGE') {
    let parsed = null;
    if (typeof jsonStringOrObj === 'string') {
      try {
        parsed = JSON.parse(jsonStringOrObj);
      } catch (err) {
        throw new Error('Format JSON impor tidak valid: ' + err.message);
      }
    } else {
      parsed = jsonStringOrObj;
    }

    const entries = Array.isArray(parsed) ? parsed : (parsed.entries || []);
    if (!Array.isArray(entries)) {
      throw new Error('Data impor harus memiliki array "entries".');
    }

    if (mode === 'REPLACE') {
      // Clear user catalog only
      this.userCatalog.clear();
      if (this.db) {
        await new Promise((resolve, reject) => {
          const tx = this.db.transaction([STORE_NAME], 'readwrite');
          const store = tx.objectStore(STORE_NAME);
          const req = store.clear();
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      }
    }

    let addedCount = 0;
    for (const raw of entries) {
      if (!raw || !raw.code) continue;
      // Skip if exactly in core and mode is MERGE
      const isCore = this.coreCatalog.some(c => c.code === raw.code);
      if (isCore && mode === 'MERGE') {
        continue;
      }

      // Security sanitation
      const { apiKey, geminiKey, secret, password, ...safeItem } = raw;

      await this.add({
        ...safeItem,
        status: safeItem.status || 'APPROVED',
        source: safeItem.source || 'USER'
      });
      addedCount++;
    }

    return { success: true, count: addedCount, mode };
  }

  /**
   * Reset User Catalog saja (Core Catalog tetap aman)
   */
  async resetUserCatalog() {
    this.userCatalog.clear();
    if (this.db) {
      await new Promise((resolve, reject) => {
        const tx = this.db.transaction([STORE_NAME], 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
    }
    return true;
  }
}
