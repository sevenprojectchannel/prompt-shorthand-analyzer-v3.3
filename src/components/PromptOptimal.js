/**
 * PromptOptimal Component V2
 * Menampilkan hasil prompt bersih siap pakai dengan shorthand terpasang.
 * Tombol SALIN PROMPT hanya menyalin main prompt bersih tanpa metadata tambahan.
 */

import { renderInstalledShorthands } from './InstalledShorthands.js';
import { countWords, estimateTokens, calculateShorthandDensity } from '../lib/promptFormatter.js';

export function renderPromptOptimal({
  optimalPrompt = '',
  installedShorthands = [],
  catalog = [],
  isOnlineActive = false,
  isEnriching = false,
  onCopyPrompt,
  onEnrichPrompt,
  onRemoveShorthand,
  onAddShorthand
}) {
  const installedComponent = renderInstalledShorthands({
    installedShorthands,
    catalog,
    onRemoveShorthand,
    onAddShorthand
  });

  const wordCount = countWords(optimalPrompt);
  const tokenEst = estimateTokens(optimalPrompt);
  const density = calculateShorthandDensity(optimalPrompt, installedShorthands);

  const html = `
    <section class="panel analyzer-card card-prompt-optimal" id="card-prompt-optimal">
      <div class="card-header">
        <div class="card-title">
          <svg class="icon" viewBox="0 0 24 24" style="color: #60a5fa;"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <h2 style="color: #93c5fd;">PROMPT OPTIMAL</h2>
        </div>
        <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
          <span style="font-size: 0.775rem; color: var(--text-muted); font-family: var(--font-mono);">
            ${wordCount} kata &bull; ~${tokenEst} token
          </span>
          <button 
            type="button" 
            class="btn btn-enrich btn-sm" 
            id="btn-enrich-ai" 
            ${!isOnlineActive || isEnriching || !optimalPrompt ? 'disabled' : ''}
            title="${!isOnlineActive ? 'Fitur ini membutuhkan koneksi Gemini API di Pengaturan' : (!optimalPrompt ? 'Lakukan analisis prompt terlebih dahulu' : 'Perkaya deskripsi visual dengan Gemini AI tanpa mengubah maksud utama')}"
          >
            ${isEnriching ? '⏳ MEMPERKAYA...' : '✨ PERKAYA DENGAN AI'}
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-copy-main-prompt" title="Hanya salin main prompt tanpa metadata">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            SALIN PROMPT
          </button>
        </div>
      </div>

      <!-- Optimal Output String Display -->
      <div class="optimal-output-box" id="optimal-prompt-display">
        <span>${optimalPrompt || '<span style="color: var(--text-muted); font-style: italic;">Prompt optimal akan muncul di sini setelah analisis...</span>'}</span>
      </div>

      <!-- Installed Shorthands Control Component -->
      ${installedComponent.html}
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      installedComponent.bindEvents(container);

      const copyBtn = container.querySelector('#btn-copy-main-prompt');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (onCopyPrompt) {
            onCopyPrompt(optimalPrompt);
          }
        });
      }

      const enrichBtn = container.querySelector('#btn-enrich-ai');
      if (enrichBtn) {
        enrichBtn.addEventListener('click', () => {
          if (onEnrichPrompt && !isEnriching && isOnlineActive && optimalPrompt) {
            onEnrichPrompt();
          }
        });
      }
    }
  };
}
