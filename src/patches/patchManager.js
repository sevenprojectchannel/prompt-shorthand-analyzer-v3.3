/**
 * SAFE PATCH-ONLY ARCHITECTURE - PATCH MANAGER
 * Prompt Shorthand Analyzer V3
 *
 * Prinsip:
 * 1. Source of Truth (V2 Baseline) diperlakukan sebagai pondasi immutable.
 * 2. Semua penambahan fitur, aturan, atau ekstensi V3 diimplementasikan
 *    sebagai Patch modular yang terisolasi.
 * 3. Eksekusi hook patch selalu dilindungi try-catch (Safe Execution Wrapper),
 *    sehingga kegagalan patch tidak akan merusak alur aplikasi dasar.
 */

export class PatchManager {
  constructor() {
    this.patches = new Map();
    this.executionLogs = [];
  }

  /**
   * Mendaftarkan patch baru ke dalam registry
   * @param {Object} patch
   * @param {string} patch.id - Identifier unik patch
   * @param {string} patch.name - Nama deskriptif patch
   * @param {string} patch.version - Versi patch
   * @param {string} [patch.description] - Penjelasan fungsi patch
   * @param {number} [patch.priority=100] - Prioritas eksekusi (angka lebih besar dieksekusi lebih dulu)
   * @param {boolean} [patch.enabled=true] - Status aktif patch
   * @param {Object} patch.hooks - Hook fungsi yang didukung
   */
  registerPatch(patch) {
    if (!patch || !patch.id) {
      throw new Error('[PatchManager] Patch wajib memiliki id yang valid.');
    }

    const normalizedPatch = {
      id: patch.id,
      name: patch.name || patch.id,
      version: patch.version || '1.0.0',
      description: patch.description || '',
      priority: typeof patch.priority === 'number' ? patch.priority : 100,
      enabled: patch.enabled !== false,
      hooks: patch.hooks || {},
      registeredAt: new Date().toISOString()
    };

    this.patches.set(patch.id, normalizedPatch);
    return normalizedPatch;
  }

  /**
   * Mengambil seluruh patch terdaftar berurutan berdasarkan prioritas
   */
  getActivePatches(hookName = null) {
    return Array.from(this.patches.values())
      .filter(p => p.enabled && (!hookName || typeof p.hooks[hookName] === 'function'))
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Mengambil daftar seluruh patch (aktif dan non-aktif)
   */
  getAllPatches() {
    return Array.from(this.patches.values()).sort((a, b) => b.priority - a.priority);
  }

  /**
   * Mengaktifkan atau menonaktifkan patch secara dinamis
   */
  setPatchEnabled(id, enabled) {
    const patch = this.patches.get(id);
    if (patch) {
      patch.enabled = Boolean(enabled);
      return true;
    }
    return false;
  }

  /**
   * Eksekusi aman (Safe Execution Wrapper) untuk hook pipeline
   */
  safeExecuteHook(hookName, initialValue, context = {}) {
    let currentValue = initialValue;
    const activePatches = this.getActivePatches(hookName);

    for (const patch of activePatches) {
      try {
        const hookFn = patch.hooks[hookName];
        if (typeof hookFn === 'function') {
          const patchedValue = hookFn(currentValue, context);
          if (patchedValue !== undefined) {
            currentValue = patchedValue;
          }
        }
      } catch (err) {
        console.warn(`[PatchManager] Peringatan: Patch "${patch.id}" pada hook "${hookName}" gagal dieksekusi:`, err);
        this.executionLogs.push({
          timestamp: new Date().toISOString(),
          patchId: patch.id,
          hookName,
          error: err.message,
          stack: err.stack
        });
        // Tetap lanjutkan pipeline tanpa menghentikan alur dasar
      }
    }

    return currentValue;
  }

  /**
   * Eksekusi hook async secara aman
   */
  async safeExecuteHookAsync(hookName, initialValue, context = {}) {
    let currentValue = initialValue;
    const activePatches = this.getActivePatches(hookName);

    for (const patch of activePatches) {
      try {
        const hookFn = patch.hooks[hookName];
        if (typeof hookFn === 'function') {
          const patchedValue = await hookFn(currentValue, context);
          if (patchedValue !== undefined) {
            currentValue = patchedValue;
          }
        }
      } catch (err) {
        console.warn(`[PatchManager] Peringatan: Async Patch "${patch.id}" pada hook "${hookName}" gagal:`, err);
        this.executionLogs.push({
          timestamp: new Date().toISOString(),
          patchId: patch.id,
          hookName,
          error: err.message
        });
      }
    }

    return currentValue;
  }
}

// Global Singleton Instance untuk V3
export const globalPatchManager = new PatchManager();
