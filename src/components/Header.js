/**
 * Header Component V2
 */

import { GEMINI_STATUS } from '../services/geminiService.js';

export function renderHeader(activeTab, geminiStatusInfo, onTabChange, onOpenSettings) {
  const { status } = geminiStatusInfo;

  let statusClass = 'status-unconfigured';
  let statusText = 'Gemini: Belum diuji';
  let statusDot = '🟡';

  if (status === GEMINI_STATUS.CONNECTED) {
    statusClass = 'status-connected';
    statusText = 'Gemini: Tersambung';
    statusDot = '🟢';
  } else if (status === GEMINI_STATUS.FAILED) {
    statusClass = 'status-failed';
    statusText = 'Gemini: Gagal';
    statusDot = '🔴';
  }

  const headerHtml = `
    <header class="app-header">
      <div class="header-container">
        <div class="brand-wrapper">
          <div class="brand-logo" aria-hidden="true">&lt;/&gt;</div>
          <div class="brand-text">
            <h1>
              PROMPT SHORTHAND ANALYZER
              <span class="version-tag">V3.3</span>
            </h1>
            <p>Contextual Shorthand Notation &amp; Semantic Preservation</p>
          </div>
        </div>

        <nav class="nav-menu" role="tablist">
          <button type="button" class="nav-item ${activeTab === 'analyzer' ? 'active' : ''}" data-tab="analyzer" role="tab" aria-selected="${activeTab === 'analyzer'}">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Analyzer
          </button>
          <button type="button" class="nav-item ${activeTab === 'dictionary' ? 'active' : ''}" data-tab="dictionary" role="tab" aria-selected="${activeTab === 'dictionary'}">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
            Kamus Shorthand
          </button>
          <button type="button" class="nav-item ${activeTab === 'json-test' ? 'active' : ''}" data-tab="json-test" role="tab" aria-selected="${activeTab === 'json-test'}">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m2 4v2h10V7H7m0 4v2h10v-2H7m0 4v2h7v-2H7Z"/></svg>
            Test (JSON)
          </button>
          <button type="button" class="nav-item ${activeTab === 'catalog' ? 'active' : ''}" data-tab="catalog" role="tab" aria-selected="${activeTab === 'catalog'}">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/></svg>
            Catalog
          </button>
          <button type="button" class="nav-item ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings" role="tab" aria-selected="${activeTab === 'settings'}">
            <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
            API &amp; Pengaturan
          </button>
        </nav>

        <div class="header-actions">
          <button type="button" class="status-badge ${statusClass}" id="header-status-badge" title="Klik untuk membuka API &amp; Pengaturan">
            <span class="status-dot"></span>
            <span>${statusText}</span>
          </button>
        </div>
      </div>
    </header>
  `;

  return {
    html: headerHtml,
    bindEvents(container) {
      container.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.getAttribute('data-tab');
          if (onTabChange) onTabChange(tab);
        });
      });

      const badge = container.querySelector('#header-status-badge');
      if (badge && onOpenSettings) {
        badge.addEventListener('click', () => onOpenSettings());
      }
    }
  };
}
