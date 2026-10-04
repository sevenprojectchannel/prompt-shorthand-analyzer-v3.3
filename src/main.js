/**
 * Main Application Orchestrator V2.1
 * Prompt Shorthand Analyzer V2.1
 * Terintegrasi dengan CatalogRepository (Core Read-only + User IndexedDB Persistent),
 * Primary & Related Shorthand separation, dan Semantic Deduplication.
 */

import './styles/main.css';
import './styles/components.css';

import { INITIAL_SHORTHAND_CATALOG } from './data/catalogData.js';
import { CatalogRepository } from './services/catalogRepository.js';
import { StorageService } from './services/storageService.js';
import { GeminiService, GEMINI_STATUS } from './services/geminiService.js';
import { cleanPromptForCopy } from './lib/promptFormatter.js';

import { renderHeader } from './components/Header.js';
import { renderAnalyzerPage } from './components/AnalyzerPage.js';
import { renderDictionaryPage } from './components/DictionaryPage.js';
import { renderJsonTestPage } from './components/JsonTestPage.js';
import { renderCatalogPage } from './components/CatalogPage.js';
import { renderSettingsPage } from './components/SettingsPage.js';
import { DictionaryService } from './services/dictionaryService.js';

class App {
  constructor() {
    this.appRoot = document.getElementById('app');

    // Central Catalog Repository
    this.catalogRepo = new CatalogRepository(INITIAL_SHORTHAND_CATALOG);
    this.catalog = this.catalogRepo.getAll();
    this.geminiService = new GeminiService(this.catalog);

    // Initial state
    this.activeTab = 'analyzer';
    this.currentPrompt = '';
    this.isAnalyzing = false;
    this.catalogCategory = 'ALL';
    this.catalogTarget = 'ALL';
    this.catalogRecLevel = 'ALL';
    this.catalogSearchQuery = '';
    this.catalogCurrentPage = 1;
    this.selectedDetailCode = null;
    this.isAddModalOpen = false;
    this.isImportModalOpen = false;
    this.duplicateWarning = null;
    this.isEnrichingPrompt = false;

    // Dictionary (Kamus Shorthand) State
    this.dictionaryState = {
      searchQuery: '',
      searchResults: [],
      selectedShorthands: [],
      isSearching: false,
      searchNotice: null,
      hasSearched: false
    };

    // Initialize with empty analysis result
    this.analysisResult = this.geminiService.localEngine.getEmptyResult();

    // Async init
    this.initRepository();
    this.initGeminiStatus();
  }

  async initRepository() {
    try {
      await this.catalogRepo.init();
      this.catalog = this.catalogRepo.getAll();
      this.geminiService.catalog = this.catalog;
      this.geminiService.localEngine.catalog = this.catalog;
      this.render();
    } catch (err) {
      console.warn('Repository init error:', err);
    }
  }

  async initGeminiStatus() {
    const key = StorageService.getApiKey();
    if (key) {
      // Test quietly in background to set accurate status indicator
      const res = await this.geminiService.testConnection(key);
      this.render();
    }
  }

  showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  async runAnalysis(promptText, installedOverrides = null) {
    if (!promptText || !promptText.trim()) {
      this.showToast('Silakan masukkan prompt terlebih dahulu', 'error');
      return;
    }

    this.currentPrompt = promptText;
    this.isAnalyzing = true;
    this.render();

    try {
      const result = await this.geminiService.analyzePrompt(promptText, installedOverrides);
      this.analysisResult = result;
      this.showToast('Analisis prompt selesai!');
    } catch (err) {
      this.showToast(`Gagal menganalisis: ${err.message}`, 'error');
    } finally {
      this.isAnalyzing = false;
      this.render();
    }
  }

  /**
   * Reset Analyzer state only.
   * Tidak pernah menghapus atau mengubah CatalogRepository.
   */
  handleReset() {
    this.currentPrompt = '';
    this.analysisResult = this.geminiService.localEngine.getEmptyResult();
    this.showToast('Analyzer telah di-reset ke kondisi awal.');
    this.render();
  }

  handleClear() {
    this.currentPrompt = '';
    this.analysisResult = this.geminiService.localEngine.getEmptyResult();
    this.render();
  }

  handleSelectPreset(presetPrompt) {
    this.currentPrompt = presetPrompt;
    this.runAnalysis(presetPrompt);
  }

  handleCopyPrompt(promptToCopy) {
    const clean = cleanPromptForCopy(promptToCopy);
    if (!clean) {
      this.showToast('Tidak ada prompt untuk disalin', 'error');
      return;
    }

    navigator.clipboard.writeText(clean).then(() => {
      this.showToast('✅ Main Prompt berhasil disalin ke clipboard!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = clean;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      this.showToast('✅ Main Prompt berhasil disalin!');
    });
  }

  async handleEnrichPrompt() {
    const currentOptimal = this.analysisResult?.optimalPrompt || '';
    if (!currentOptimal || !currentOptimal.trim()) {
      this.showToast('Belum ada Prompt Optimal untuk diperkaya.', 'error');
      return;
    }

    const hasApiKey = Boolean(StorageService.getApiKey() && StorageService.getApiKey().trim());
    if (!hasApiKey || this.geminiService.status === GEMINI_STATUS.FAILED) {
      this.showToast('Fitur ini membutuhkan koneksi Gemini API di Pengaturan.', 'error');
      return;
    }

    if (this.isEnrichingPrompt) {
      return;
    }

    this.isEnrichingPrompt = true;
    this.render();

    try {
      this.showToast('Memperkaya prompt dengan Gemini AI...', 'info');
      const res = await this.geminiService.enrichPrompt(currentOptimal, this.analysisResult);
      if (res && res.success && res.enrichedPrompt) {
        this.analysisResult.optimalPrompt = res.enrichedPrompt;
        this.showToast('✨ Prompt Optimal berhasil diperkaya dengan AI!', 'success');
      } else {
        throw new Error('Hasil pengayaan AI tidak valid.');
      }
    } catch (err) {
      console.warn('Enrich prompt error:', err);
      this.showToast(`Gagal memperkaya prompt: ${err.message}`, 'error');
    } finally {
      this.isEnrichingPrompt = false;
      this.render();
    }
  }

  handleAddShorthand(code) {
    if (!code) return;
    const currentInstalled = this.analysisResult.installedShorthands || [];
    if (!currentInstalled.includes(code)) {
      const updated = [...currentInstalled, code];
      this.updateInstalledShorthands(updated);
      this.showToast(`Shorthand ${code} ditambahkan.`);
    }
  }

  handleRemoveShorthand(code) {
    const currentInstalled = this.analysisResult.installedShorthands || [];
    const updated = currentInstalled.filter(c => c !== code);
    this.updateInstalledShorthands(updated);
    this.showToast(`Shorthand ${code} dilepas.`);
  }

  handleToggleRecommendation(code) {
    const currentInstalled = this.analysisResult.installedShorthands || [];
    if (currentInstalled.includes(code)) {
      this.handleRemoveShorthand(code);
    } else {
      this.handleAddShorthand(code);
    }
  }

  updateInstalledShorthands(newInstalledList) {
    this.analysisResult.installedShorthands = newInstalledList;
    // Reconstruct optimal prompt
    this.analysisResult.optimalPrompt = this.geminiService.localEngine.buildOptimalPrompt(
      this.analysisResult.cleanText,
      newInstalledList
    );

    // Sync active and checked states on cards
    if (this.analysisResult.recommendations) {
      for (const rec of this.analysisResult.recommendations) {
        rec.checked = newInstalledList.includes(rec.code);
        rec.active = rec.checked;
      }
    }
    if (this.analysisResult.primaryShorthands) {
      for (const p of this.analysisResult.primaryShorthands) {
        p.checked = newInstalledList.includes(p.code);
        p.active = p.checked;
      }
    }
    if (this.analysisResult.relatedShorthands) {
      for (const r of this.analysisResult.relatedShorthands) {
        r.checked = newInstalledList.includes(r.code);
        r.active = r.checked;
      }
    }

    this.render();
  }

  handleResolveConflict(conflictId, action) {
    const conflict = this.analysisResult.conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    let updated = [...(this.analysisResult.installedShorthands || [])];
    const isLockConflict = conflict.type === 'EDIT_VS_LOCK' || (conflict.shorthandA && conflict.shorthandA.includes('lock'));

    if (action === 'use_user_edit') {
      // Keep edit / option B, remove lock / option A
      updated = updated.filter(c => c !== conflict.shorthandA);
      const toastMsg = isLockConflict
        ? `Kunci ${conflict.shorthandA} dilepas sesuai instruksi ubah.`
        : `Memilih ${conflict.shorthandB}, ${conflict.shorthandA} dihapus.`;
      this.showToast(toastMsg);
    } else if (action === 'keep_lock') {
      // Keep lock / option A, remove edit / option B
      updated = updated.filter(c => c !== conflict.shorthandB);
      if (!updated.includes(conflict.shorthandA)) {
        updated.push(conflict.shorthandA);
      }
      const toastMsg = isLockConflict
        ? `Lock ${conflict.shorthandA} dipertahankan.`
        : `Memilih ${conflict.shorthandA}, ${conflict.shorthandB} dihapus.`;
      this.showToast(toastMsg);
    } else if (action === 'dismiss') {
      this.showToast('Peringatan konflik diabaikan.');
    }

    // Filter out resolved conflict
    this.analysisResult.conflicts = this.analysisResult.conflicts.filter(c => c.id !== conflictId);
    this.updateInstalledShorthands(updated);
  }

  // --- Catalog Actions ---
  async handleAddShorthandSubmit(entry) {
    if (!this.duplicateWarning) {
      const sim = this.catalogRepo.detectSimilarFunction(entry);
      if (sim.hasSimilar) {
        this.duplicateWarning = sim;
        this.render();
        return;
      }
    }

    try {
      await this.catalogRepo.add(entry);
      this.catalog = this.catalogRepo.getAll();
      this.geminiService.catalog = this.catalog;
      this.geminiService.localEngine.catalog = this.catalog;
      this.isAddModalOpen = false;
      this.duplicateWarning = null;
      this.showToast(`Shorthand ${entry.code} berhasil disimpan ke User Catalog!`);
      this.render();
    } catch (err) {
      this.showToast(`Gagal menambahkan: ${err.message}`, 'error');
    }
  }

  handleExportCatalog() {
    try {
      const json = this.catalogRepo.exportCatalog();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `psa-v2-catalog-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      this.showToast('✅ Katalog berhasil diekspor (JSON aman tanpa rahasia)!');
    } catch (err) {
      this.showToast(`Gagal mengekspor: ${err.message}`, 'error');
    }
  }

  async handleImportCatalog(jsonText, mode) {
    if (!jsonText || !jsonText.trim()) {
      this.showToast('Silakan pilih file atau paste JSON katalog.', 'error');
      return;
    }
    try {
      const res = await this.catalogRepo.importCatalog(jsonText, mode);
      this.catalog = this.catalogRepo.getAll();
      this.geminiService.catalog = this.catalog;
      this.geminiService.localEngine.catalog = this.catalog;
      this.isImportModalOpen = false;
      this.showToast(`✅ Berhasil mengimpor ${res.count} shorthand (${mode})!`);
      this.render();
    } catch (err) {
      this.showToast(`Gagal impor: ${err.message}`, 'error');
    }
  }

  async handleResetUserCatalog() {
    try {
      await this.catalogRepo.resetUserCatalog();
      this.catalog = this.catalogRepo.getAll();
      this.geminiService.catalog = this.catalog;
      this.geminiService.localEngine.catalog = this.catalog;
      this.showToast('User Catalog berhasil direset. Core Catalog tetap aman.');
      this.render();
    } catch (err) {
      this.showToast(`Gagal mereset: ${err.message}`, 'error');
    }
  }

  async handleTestConnection(apiKey, modelName) {
    this.showToast('Menguji koneksi ke Gemini API...', 'info');
    const res = await this.geminiService.testConnection(apiKey, modelName);
    if (res.success) {
      this.showToast(res.message, 'success');
    } else {
      this.showToast(res.message, 'error');
    }
    this.render();
  }

  handleSaveSettings(apiKey, modelName) {
    StorageService.setApiKey(apiKey);
    StorageService.setModel(modelName);
    this.showToast('Pengaturan BYOK berhasil disimpan!', 'success');
    this.geminiService.testConnection(apiKey, modelName).then(() => this.render());
  }

  handleClearKey() {
    StorageService.clearApiKey();
    this.geminiService.status = GEMINI_STATUS.UNCONFIGURED;
    this.showToast('API Key telah dihapus dari perangkat ini.');
    this.render();
  }

  // --- KAMUS SHORTHAND HANDLERS ---
  async handleDictionarySearch(query) {
    this.dictionaryState.searchQuery = query;
    if (!query || !query.trim()) {
      this.dictionaryState.searchResults = [];
      this.dictionaryState.hasSearched = false;
      this.dictionaryState.searchNotice = null;
      this.render();
      return;
    }

    this.dictionaryState.isSearching = true;
    this.dictionaryState.hasSearched = true;
    this.render();

    try {
      const searchRes = await DictionaryService.search(query, this.catalog, this.geminiService);
      this.dictionaryState.isSearching = false;
      this.dictionaryState.searchResults = searchRes.results;
      this.dictionaryState.searchNotice = searchRes.notice;
    } catch (err) {
      console.warn('Dictionary search error:', err);
      this.dictionaryState.isSearching = false;
      this.dictionaryState.searchResults = [];
      this.dictionaryState.searchNotice = 'Pencarian shorthand sedang tidak tersedia. Silakan coba lagi.';
    }
    this.render();
  }

  handleDictionaryAddShorthand(item) {
    if (!item) return;
    const code = (item.code || '').trim();
    if (!code) return;

    const alreadySelected = this.dictionaryState.selectedShorthands.some(
      s => (typeof s === 'string' ? s : s.code).toLowerCase() === code.toLowerCase()
    );

    if (!alreadySelected) {
      this.dictionaryState.selectedShorthands.push(item);
      this.showToast(`Ditambahkan: ${code}`);
      this.render();
    } else {
      this.showToast(`${code} sudah ada di daftar terpilih`, 'info');
    }
  }

  handleDictionaryRemoveShorthand(code) {
    if (!code) return;
    this.dictionaryState.selectedShorthands = this.dictionaryState.selectedShorthands.filter(
      s => (typeof s === 'string' ? s : s.code).toLowerCase() !== code.toLowerCase()
    );
    this.showToast(`Dihapus: ${code}`, 'info');
    this.render();
  }

  handleDictionaryClearAll() {
    this.dictionaryState.selectedShorthands = [];
    this.showToast('Seluruh shorthand terpilih telah dikosongkan.', 'info');
    this.render();
  }

  async handleDictionaryCopy() {
    const copyText = DictionaryService.formatSelectedForCopy(this.dictionaryState.selectedShorthands);
    if (!copyText) {
      this.showToast('Belum ada shorthand yang dipilih untuk disalin.', 'warning');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(copyText);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = copyText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.showToast(`✓ Shorthand berhasil disalin: ${copyText}`);
    } catch (err) {
      console.warn('Copy failed:', err);
      this.showToast(`Shorthand: ${copyText}`);
    }
  }

  render() {
    const geminiStatusInfo = this.geminiService.getStatus();

    // 1. Header
    const headerComponent = renderHeader(
      this.activeTab,
      geminiStatusInfo,
      (tab) => {
        this.activeTab = tab;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      () => {
        this.activeTab = 'settings';
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );

    // 2. Main Page View
    let pageContent = null;

    if (this.activeTab === 'analyzer') {
      const hasApiKey = Boolean(StorageService.getApiKey() && StorageService.getApiKey().trim());
      const isOnlineActive = hasApiKey && this.geminiService.status !== GEMINI_STATUS.FAILED;

      pageContent = renderAnalyzerPage({
        analysisResult: this.analysisResult,
        currentPrompt: this.currentPrompt,
        catalog: this.catalog,
        isAnalyzing: this.isAnalyzing,
        isOnlineActive,
        isEnriching: this.isEnrichingPrompt,
        onAnalyze: (text) => this.runAnalysis(text),
        onReset: () => this.handleReset(),
        onClear: () => this.handleClear(),
        onSelectPreset: (text) => this.handleSelectPreset(text),
        onCopyPrompt: (prompt) => this.handleCopyPrompt(prompt),
        onEnrichPrompt: () => this.handleEnrichPrompt(),
        onAddShorthand: (code) => this.handleAddShorthand(code),
        onRemoveShorthand: (code) => this.handleRemoveShorthand(code),
        onToggleRecommendation: (code) => this.handleToggleRecommendation(code),
        onResolveConflict: (id, act) => this.handleResolveConflict(id, act)
      });
    } else if (this.activeTab === 'json-test') {
      pageContent = renderJsonTestPage({
        analysisResult: this.analysisResult,
        onCopyJson: (jsonStr) => {
          navigator.clipboard.writeText(jsonStr);
          this.showToast('Output JSON berhasil disalin!');
        }
      });
    } else if (this.activeTab === 'catalog') {
      pageContent = renderCatalogPage({
        catalog: this.catalog,
        activeCategory: this.catalogCategory,
        activeTarget: this.catalogTarget,
        activeRecLevel: this.catalogRecLevel,
        searchQuery: this.catalogSearchQuery,
        currentPage: this.catalogCurrentPage,
        pageSize: 12,
        selectedDetailCode: this.selectedDetailCode,
        isAddModalOpen: this.isAddModalOpen,
        isImportModalOpen: this.isImportModalOpen,
        duplicateWarning: this.duplicateWarning,
        onSelectCategory: (cat) => {
          this.catalogCategory = cat;
          this.catalogCurrentPage = 1;
          this.render();
        },
        onSelectTarget: (tgt) => {
          this.catalogTarget = tgt;
          this.catalogCurrentPage = 1;
          this.render();
        },
        onSelectRecLevel: (lvl) => {
          this.catalogRecLevel = lvl;
          this.catalogCurrentPage = 1;
          this.render();
        },
        onSearchChange: (query) => {
          this.catalogSearchQuery = query;
          this.catalogCurrentPage = 1;
          this.render();
        },
        onPageChange: (newPage) => {
          this.catalogCurrentPage = newPage;
          this.render();
        },
        onOpenDetail: (code) => {
          this.selectedDetailCode = code;
          this.render();
        },
        onCloseDetail: () => {
          this.selectedDetailCode = null;
          this.render();
        },
        onOpenAddModal: () => {
          this.isAddModalOpen = true;
          this.duplicateWarning = null;
          this.render();
        },
        onCloseAddModal: () => {
          this.isAddModalOpen = false;
          this.duplicateWarning = null;
          this.render();
        },
        onSubmitAddShorthand: async (entry) => {
          await this.handleAddShorthandSubmit(entry);
        },
        onOpenImportModal: () => {
          this.isImportModalOpen = true;
          this.render();
        },
        onCloseImportModal: () => {
          this.isImportModalOpen = false;
          this.render();
        },
        onSubmitImport: async (jsonText, mode) => {
          await this.handleImportCatalog(jsonText, mode);
        },
        onExportCatalog: () => {
          this.handleExportCatalog();
        },
        onResetUserCatalog: async () => {
          if (confirm('Apakah Anda yakin ingin mereset User Catalog? Shorthand custom Anda akan dihapus. CORE CATALOG bawaan tetap 100% aman.')) {
            await this.handleResetUserCatalog();
          }
        },
        onAddShorthandToPrompt: (code) => {
          this.handleAddShorthand(code);
          this.activeTab = 'analyzer';
          this.render();
          this.showToast(`Shorthand ${code} ditambahkan ke prompt analyzer!`);
        }
      });
    } else if (this.activeTab === 'dictionary') {
      pageContent = renderDictionaryPage({
        searchQuery: this.dictionaryState.searchQuery,
        searchResults: this.dictionaryState.searchResults,
        selectedShorthands: this.dictionaryState.selectedShorthands,
        isSearching: this.dictionaryState.isSearching,
        searchNotice: this.dictionaryState.searchNotice,
        hasSearched: this.dictionaryState.hasSearched,
        onSearch: (q) => this.handleDictionarySearch(q),
        onAddShorthand: (item) => this.handleDictionaryAddShorthand(item),
        onRemoveShorthand: (code) => this.handleDictionaryRemoveShorthand(code),
        onClearAll: () => this.handleDictionaryClearAll(),
        onCopyShorthands: () => this.handleDictionaryCopy()
      });
    } else if (this.activeTab === 'settings') {
      pageContent = renderSettingsPage({
        geminiStatusInfo,
        onTestConnection: (key, model) => this.handleTestConnection(key, model),
        onSaveSettings: (key, model) => this.handleSaveSettings(key, model),
        onClearKey: () => this.handleClearKey()
      });
    }

    // 3. Assemble DOM
    this.appRoot.innerHTML = `
      <div class="app-container">
        ${headerComponent.html}
        <main class="main-content">
          ${pageContent.html}
        </main>
        <footer class="app-footer">
          <div class="footer-container">
            <div>
              <strong>PROMPT SHORTHAND ANALYZER V3.0</strong> &mdash; Safe Patch-Only Architecture
            </div>
            <div>
              BYOK Gemini API &bull; Fallback Offline Heuristic &bull; Kamus Shorthand Enabled
            </div>
          </div>
        </footer>
      </div>
    `;

    // 4. Bind interactive events
    headerComponent.bindEvents(this.appRoot);
    if (pageContent.bindEvents) {
      pageContent.bindEvents(this.appRoot);
    }
  }
}

// Bootstrapping
document.addEventListener('DOMContentLoaded', () => {
  window.__PSA_APP__ = new App();
  window.__PSA_APP__.render();
});
