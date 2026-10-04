/**
 * Storage Service V2
 * Manajemen penyimpanan aman client-side di localStorage.
 * Tidak pernah mengirimkan kredensial rahasia ke server luar.
 */

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'psa_v2_gemini_api_key',
  GEMINI_MODEL: 'psa_v2_gemini_model',
  CUSTOM_CATALOG: 'psa_v2_custom_catalog',
  UI_PREFS: 'psa_v2_ui_preferences',
  RECENT_PROMPTS: 'psa_v2_recent_prompts'
};

export const StorageService = {
  getApiKey() {
    try {
      return localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY) || '';
    } catch {
      return '';
    }
  },

  setApiKey(key) {
    try {
      if (!key) {
        localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
      } else {
        localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
      }
      return true;
    } catch {
      return false;
    }
  },

  clearApiKey() {
    try {
      localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
      return true;
    } catch {
      return false;
    }
  },

  getModel() {
    try {
      return localStorage.getItem(STORAGE_KEYS.GEMINI_MODEL) || 'gemini-2.0-flash';
    } catch {
      return 'gemini-2.0-flash';
    }
  },

  setModel(modelName) {
    try {
      localStorage.setItem(STORAGE_KEYS.GEMINI_MODEL, modelName);
      return true;
    } catch {
      return false;
    }
  },

  getCustomCatalog() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CUSTOM_CATALOG);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveCustomCatalog(catalog) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_CATALOG, JSON.stringify(catalog));
      return true;
    } catch {
      return false;
    }
  },

  getUiPreferences() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.UI_PREFS);
      return data ? JSON.parse(data) : { theme: 'dark', autoAnalyze: true };
    } catch {
      return { theme: 'dark', autoAnalyze: true };
    }
  },

  saveUiPreferences(prefs) {
    try {
      localStorage.setItem(STORAGE_KEYS.UI_PREFS, JSON.stringify(prefs));
      return true;
    } catch {
      return false;
    }
  }
};
