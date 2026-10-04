/**
 * DictionaryPage Component (Kamus Shorthand)
 * Prompt Shorthand Analyzer V3
 *
 * Mendukung alur kerja:
 * SEARCH -> [+] -> SEARCH LAGI -> [+] -> COPY
 */

export function renderDictionaryPage({
  searchQuery = '',
  searchResults = [],
  selectedShorthands = [],
  isSearching = false,
  searchNotice = null,
  hasSearched = false,
  onSearch,
  onAddShorthand,
  onRemoveShorthand,
  onClearAll,
  onCopyShorthands
}) {
  const selectedCodesSet = new Set(selectedShorthands.map(s => (s.code || s).toLowerCase()));
  const hasSelected = selectedShorthands.length > 0;

  // Render Panel "📌 SHORTHAND TERPILIH"
  let selectedTagsHtml = '';
  if (hasSelected) {
    selectedTagsHtml = selectedShorthands
      .map((item, index) => {
        const code = typeof item === 'string' ? item : item.code;
        const name = typeof item === 'object' && item.name ? item.name : '';
        const isOnline = typeof item === 'object' && item.source === 'ONLINE';
        return `
          <div class="selected-shorthand-tag ${isOnline ? 'tag-online' : ''}" title="${name ? name + ' - ' : ''}Klik × untuk menghapus">
            <span class="tag-code">${code}</span>
            <button type="button" class="btn-remove-tag" data-code="${code}" aria-label="Hapus ${code}">
              &times;
            </button>
          </div>
        `;
      })
      .join('');
  } else {
    selectedTagsHtml = `
      <div class="empty-selected-notice">
        Belum ada shorthand yang dipilih. Cari shorthand di bawah lalu tekan tombol <strong>[ + ]</strong>.
      </div>
    `;
  }

  // Render Kartu Hasil Pencarian
  let resultsHtml = '';
  if (isSearching) {
    resultsHtml = `
      <div class="searching-state">
        <div class="spinner"></div>
        <span>Mencari di katalog lokal &amp; online fallback...</span>
      </div>
    `;
  } else if (hasSearched && searchResults.length === 0) {
    resultsHtml = `
      <div class="no-results-card">
        <div class="no-results-icon">🔍</div>
        <p class="no-results-text">
          ${searchNotice || 'Shorthand tidak ditemukan di katalog lokal dan pencarian online tidak tersedia.'}
        </p>
      </div>
    `;
  } else if (searchResults.length > 0) {
    resultsHtml = `
      <div class="dictionary-results-grid">
        ${searchResults
          .map(item => {
            const isSelected = selectedCodesSet.has((item.code || '').toLowerCase());
            const isOnline = item.source === 'ONLINE';
            const badgeClass = isOnline ? 'badge-online' : 'badge-local';
            const badgeText = isOnline ? '🌐 ONLINE' : 'LOCAL';

            return `
              <div class="dictionary-card ${isSelected ? 'card-selected' : ''}" data-code="${item.code}">
                <div class="card-top">
                  <div class="card-code-wrapper">
                    <span class="card-code">${item.code}</span>
                    <span class="source-badge ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="card-action">
                    ${
                      isSelected
                        ? `
                          <button type="button" class="btn btn-sm btn-selected-state" disabled title="Shorthand ini sudah masuk daftar terpilih">
                            <span class="check-icon">✓</span> DIPILIH
                          </button>
                        `
                        : `
                          <button type="button" class="btn btn-sm btn-add-shorthand" data-code="${item.code}" title="Tambahkan ${item.code} ke daftar terpilih">
                            <span class="plus-icon">+</span> Tambah
                          </button>
                        `
                    }
                  </div>
                </div>

                <div class="card-content">
                  <div class="card-name">${item.name || item.code}</div>
                  <div class="card-desc">${item.description || 'Tidak ada deskripsi'}</div>
                  ${item.equivalentTo && item.equivalentTo.length > 0 ? `
                    <div class="card-equivalents" style="margin-top: 6px; font-size: 0.78rem; color: var(--text-muted, #94a3b8); display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                      <span style="opacity: 0.75;">Mewakili:</span>
                      ${item.equivalentTo.slice(0, 4).map(eq => `<span style="background: rgba(255,255,255,0.06); padding: 1px 6px; border-radius: 4px; font-family: monospace;">${eq}</span>`).join('')}
                      ${item.equivalentTo.length > 4 ? `<span style="opacity: 0.6;">+${item.equivalentTo.length - 4} lainnya</span>` : ''}
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  } else {
    // Tampilan awal sebelum mencari
    resultsHtml = `
      <div class="initial-search-hint">
        <p>Ketik kata kunci untuk mencari notasi shorthand visual. Contoh: <code>wajah</code>, <code>rambut</code>, <code>pencahayaan</code>, <code>ketajaman</code>, <code>cinematic</code>, <code>portrait</code>.</p>
      </div>
    `;
  }

  const html = `
    <div class="dictionary-page-container">
      <!-- HEADER PANEL -->
      <section class="panel dictionary-header-panel">
        <div class="card-header">
          <div class="card-title">
            <span style="font-size: 1.4rem;">📚</span>
            <h2>KAMUS SHORTHAND</h2>
          </div>
        </div>
        <p class="panel-subtitle">
          Cari notasi shorthand satu per satu, kumpulkan dengan tombol <strong>[ + ]</strong>, dan salin seluruh shorthand yang terkumpul sekaligus. Pilihan Anda tetap aman saat mencari berulang kali.
        </p>

        <!-- PANEL SHORTHAND TERPILIH (SELALU MUNCUL DI ATAS) -->
        <div class="selected-shorthands-panel">
          <div class="selected-panel-header">
            <div class="selected-panel-title">
              <span>📌</span>
              <strong>SHORTHAND TERPILIH</strong>
              <span class="selected-count-badge">${selectedShorthands.length}</span>
            </div>
            <div class="selected-panel-actions">
              <button 
                type="button" 
                class="btn btn-secondary btn-sm" 
                id="btn-clear-all-shorthands" 
                ${!hasSelected ? 'disabled' : ''} 
                title="Kosongkan seluruh shorthand terpilih">
                🗑 Hapus Semua
              </button>
              <button 
                type="button" 
                class="btn btn-primary btn-sm" 
                id="btn-copy-selected-shorthands" 
                ${!hasSelected ? 'disabled' : ''} 
                title="Salin seluruh shorthand terpilih ke clipboard">
                📋 COPY SHORTHAND
              </button>
            </div>
          </div>

          <div class="selected-tags-container" id="selected-tags-container">
            ${selectedTagsHtml}
          </div>
        </div>
      </section>

      <!-- SEARCH SECTION -->
      <section class="panel dictionary-search-panel">
        <form id="dictionary-search-form" class="dictionary-search-form" onsubmit="return false;">
          <div class="search-input-wrapper">
            <span class="search-icon">🔍</span>
            <input 
              type="text" 
              id="dictionary-search-input" 
              class="dictionary-search-input" 
              placeholder="Cari shorthand, fungsi, atau keyword (misal: wajah, rambut, pencahayaan)..." 
              value="${searchQuery || ''}"
              autocomplete="off"
              spellcheck="false"
            />
            ${
              searchQuery
                ? `<button type="button" class="btn-clear-search" id="btn-clear-search" title="Bersihkan pencarian">&times;</button>`
                : ''
            }
          </div>
          <button type="submit" class="btn btn-primary btn-search-submit" id="btn-search-submit">
            CARI
          </button>
        </form>

        <!-- Search Status Info -->
        ${
          hasSearched && searchResults.length > 0
            ? `
              <div class="search-status-bar">
                <span>Ditemukan <strong>${searchResults.length}</strong> shorthand relevan untuk "<em>${searchQuery}</em>"</span>
                <span class="search-priority-hint">Prioritas: 1. Katalog Lokal &bull; 2. Online Fallback</span>
              </div>
            `
            : ''
        }

        <!-- RESULTS LIST -->
        <div class="results-wrapper">
          ${resultsHtml}
        </div>
      </section>
    </div>
  `;

  return {
    html,
    bindEvents(container) {
      const searchForm = container.querySelector('#dictionary-search-form');
      const searchInput = container.querySelector('#dictionary-search-input');
      const clearSearchBtn = container.querySelector('#btn-clear-search');
      const copyBtn = container.querySelector('#btn-copy-selected-shorthands');
      const clearAllBtn = container.querySelector('#btn-clear-all-shorthands');

      // 1. Submit search form
      if (searchForm && searchInput) {
        searchForm.addEventListener('submit', e => {
          e.preventDefault();
          const q = searchInput.value.trim();
          if (onSearch) onSearch(q);
        });
      }

      // 2. Clear search input
      if (clearSearchBtn && searchInput) {
        clearSearchBtn.addEventListener('click', () => {
          searchInput.value = '';
          searchInput.focus();
          if (onSearch) onSearch('');
        });
      }

      // 3. Tombol "+" Tambah Shorthand ke Terpilih
      container.querySelectorAll('.btn-add-shorthand').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-code');
          const shorthandItem = searchResults.find(r => r.code === code);
          if (shorthandItem && onAddShorthand) {
            onAddShorthand(shorthandItem);
          }
        });
      });

      // 4. Tombol "×" Hapus Shorthand dari Terpilih
      container.querySelectorAll('.btn-remove-tag').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-code');
          if (code && onRemoveShorthand) {
            onRemoveShorthand(code);
          }
        });
      });

      // 5. Tombol "📋 COPY SHORTHAND"
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (onCopyShorthands) {
            onCopyShorthands();
          }
        });
      }

      // 6. Tombol "🗑 HAPUS SEMUA"
      if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
          if (onClearAll) {
            onClearAll();
          }
        });
      }
    }
  };
}
