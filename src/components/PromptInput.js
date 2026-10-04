/**
 * PromptInput Component V2
 */

import { renderPresetTests } from './PresetTests.js';

export function renderPromptInput({
  currentValue = '',
  onAnalyze,
  onReset,
  onClear,
  onSelectPreset,
  isAnalyzing = false,
  isOnlineActive = false
}) {
  const presets = renderPresetTests(onSelectPreset);

  const html = `
    <section class="panel analyzer-card" id="card-input">
      <div class="card-header">
        <div class="card-title">
          <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          <h2>INPUT PROMPT</h2>
        </div>
        <div style="display: flex; gap: 0.4rem;">
          <button type="button" class="btn btn-outline btn-xs" id="btn-clear-prompt" title="Kosongkan teks">
            Kosongkan
          </button>
          <button type="button" class="btn btn-danger btn-xs" id="btn-reset-app" title="Kembalikan aplikasi ke keadaan awal">
            Reset
          </button>
        </div>
      </div>

      <!-- Online Shorthand Search Status Banner -->
      <div class="online-status-banner ${isOnlineActive ? 'banner-online-active' : 'banner-online-inactive'}" id="prompt-online-status-banner">
        <div class="banner-inner">
          ${isOnlineActive ? `
            <div class="banner-content">
              <span class="status-pulse-dot"></span>
              <strong class="banner-title">🌐 Pencarian Online Shorthand: AKTIF</strong>
              <span class="banner-desc">Analisis terbuka &amp; tidak terbatas — Memetakan konsep, objek, aktivitas, gaya, kanvas/outpaint, atau istilah baru ke shorthand AI yang relevan.</span>
            </div>
          ` : `
            <div class="banner-content">
              <span class="status-offline-dot">⚪</span>
              <strong class="banner-title">🖥️ Pencarian Online Shorthand: TIDAK AKTIF</strong>
              <span class="banner-desc">Berjalan dalam Mode Heuristik Lokal. Sambungkan Gemini API Key di Pengaturan untuk mengaktifkan pencarian online AI terbuka tanpa batas.</span>
            </div>
          `}
        </div>
      </div>

      <!-- Preset Test Cases -->
      <div id="presets-container">
        ${presets.html}
      </div>

      <!-- Textarea Input -->
      <div class="form-group" style="margin-bottom: 0.85rem;">
        <textarea 
          id="prompt-textarea" 
          class="textarea-prompt font-mono" 
          placeholder="Ketik atau tempelkan prompt bahasa natural Anda di sini...&#10;&#10;Contoh pencarian terbuka (apapun topik, objek, atau konsep visualnya):&#10;• memperluas foto&#10;• perbaiki pencahayaan foto&#10;• hapus hijab, jangan ubah wajah&#10;• ganti baju menjadi tanktop putih tali tipis, jangan ubah wajah&#10;• fotografer cyberpunk di jalanan tokyo dengan pantulan neon&#10;• dokter bedah di rumah sakit futuristik"
        >${currentValue || ''}</textarea>
      </div>

      <!-- Actions Bar -->
      <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
        <small style="color: var(--text-muted); font-size: 0.775rem;">
          💡 Menganalisis seluruh teks prompt secara semantik tanpa batas kategori atau batasan topik.
        </small>
        <button type="button" class="btn btn-primary" id="btn-run-analysis" ${isAnalyzing ? 'disabled' : ''}>
          <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          ${isAnalyzing ? (isOnlineActive ? 'Mencari Online...' : 'Menganalisis...') : (isOnlineActive ? '🌐 Analisis Prompt' : 'Analisis Prompt')}
        </button>
      </div>
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      presets.bindEvents(container);

      const textarea = container.querySelector('#prompt-textarea');
      const analyzeBtn = container.querySelector('#btn-run-analysis');
      const clearBtn = container.querySelector('#btn-clear-prompt');
      const resetBtn = container.querySelector('#btn-reset-app');

      if (analyzeBtn) {
        analyzeBtn.addEventListener('click', () => {
          if (onAnalyze) onAnalyze(textarea.value);
        });
      }

      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          textarea.value = '';
          if (onClear) onClear();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (onReset) onReset();
        });
      }

      // Enter key (Ctrl+Enter or Cmd+Enter) triggers analysis
      if (textarea) {
        textarea.addEventListener('keydown', (e) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            if (onAnalyze) onAnalyze(textarea.value);
          }
        });
      }
    }
  };
}
