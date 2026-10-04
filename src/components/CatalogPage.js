/**
 * CatalogPage Component V2.1
 * Semantic Shorthand Knowledge Base Browser & Management
 * Dilengkapi:
 * - Semantic Search, Multi-Filter (Kategori, Target, Level Rekomendasi)
 * - Metadata Lanjutan: Function Group, Equivalent Aliases, Semantic Relationships, Source (CORE/USER)
 * - Pagination kontrol responsif
 * - Ekspor (Sanitized JSON) & Impor (MERGE / REPLACE)
 * - Tambah Shorthand Baru dengan Deteksi Fungsi Serupa
 * - Modal Detail Lengkap
 */

import { SHORTHAND_CATEGORIES, filterCatalogKnowledgeBase, FUNCTION_GROUPS } from '../data/catalogData.js';

export function renderCatalogPage({
  catalog = [],
  activeCategory = 'ALL',
  activeTarget = 'ALL',
  activeRecLevel = 'ALL',
  searchQuery = '',
  currentPage = 1,
  pageSize = 12,
  selectedDetailCode = null,
  isAddModalOpen = false,
  isImportModalOpen = false,
  duplicateWarning = null,
  onSelectCategory,
  onSelectTarget,
  onSelectRecLevel,
  onSearchChange,
  onPageChange,
  onOpenDetail,
  onCloseDetail,
  onOpenAddModal,
  onCloseAddModal,
  onSubmitAddShorthand,
  onOpenImportModal,
  onCloseImportModal,
  onSubmitImport,
  onExportCatalog,
  onResetUserCatalog,
  onAddShorthandToPrompt
}) {
  // 1. Filter Knowledge Base
  const filtered = filterCatalogKnowledgeBase(catalog, {
    category: activeCategory,
    target: activeTarget,
    recommendationLevel: activeRecLevel,
    searchQuery
  });

  // 2. Pagination
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validPage = Math.min(Math.max(1, currentPage), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedItems = filtered.slice(startIndex, startIndex + pageSize);

  // 3. Extract unique target options
  const targetOptions = Array.from(new Set(catalog.map(c => c.target))).sort();

  // 4. Category filter tabs
  const categoryKeys = ['ALL', ...Object.keys(SHORTHAND_CATEGORIES)];
  const categoryTabsHtml = categoryKeys.map(key => {
    const cat = SHORTHAND_CATEGORIES[key];
    const label = key === 'ALL' ? 'Semua Kategori' : `${cat.code}. ${cat.label}`;
    const isActive = activeCategory === key;
    return `
      <button type="button" class="category-tab-btn ${isActive ? 'active' : ''}" data-cat="${key}">
        ${label}
      </button>
    `;
  }).join('');

  // 5. Cards grid
  const cardsHtml = paginatedItems.length > 0
    ? paginatedItems.map(item => {
        let levelBadge = 'badge-opsional';
        if (item.recommendationLevel === 'WAJIB' || item.priority === 'HIGH') levelBadge = 'badge-wajib';
        else if (item.recommendationLevel === 'DISARANKAN') levelBadge = 'badge-disarankan';

        const sourceBadge = item.source === 'USER' ? 'badge-purple' : 'badge-neutral';
        const triggersPreview = (item.semanticTriggers || []).slice(0, 3).map(t => `<span class="compat-pill">"${t}"</span>`).join(' ');
        const equivalentList = item.equivalentTo || [];
        const relationshipsList = item.relationships || [];

        return `
          <div class="catalog-item-card" data-code="${item.code}">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.35rem; flex-wrap: wrap; gap: 0.35rem;">
                <span class="catalog-item-code">${item.code}</span>
                <div style="display: flex; gap: 0.35rem; align-items: center;">
                  <span class="badge ${sourceBadge}">${item.source || 'CORE'}</span>
                  <span class="badge ${levelBadge}">${item.recommendationLevel || item.priority}</span>
                  <span class="badge badge-neutral">${item.category}</span>
                </div>
              </div>
              <h3 class="catalog-item-name">${item.name}</h3>
              <p class="catalog-item-desc" style="margin-top: 0.4rem;">${item.description}</p>
            </div>

            <!-- Structured Metadata Section -->
            <div class="catalog-meta-list" style="margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.4rem;">
              <div><strong>Target:</strong> <span style="color: #93c5fd;">${item.target}</span></div>
              ${item.functionGroup ? `<div><strong>Fungsi:</strong> <span style="color: #c084fc; font-size: 0.75rem;">${item.functionGroup}</span></div>` : ''}
              ${equivalentList.length > 0 ? `
                <div>
                  <strong>Alias:</strong> 
                  ${equivalentList.map(eq => `<span class="alias-tag font-mono">${eq}</span>`).join(' ')}
                </div>
              ` : ''}
              ${relationshipsList.length > 0 ? `
                <div>
                  <strong>Relasi:</strong> 
                  <span style="font-size: 0.75rem; color: #94a3b8;">${relationshipsList.length} terhubung (${relationshipsList.map(r => r.code).slice(0, 2).join(', ')})</span>
                </div>
              ` : ''}
              <div><strong>Triggers:</strong> ${triggersPreview || '-'}</div>
            </div>

            <!-- Card Actions -->
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.65rem; border-top: 1px solid rgba(255, 255, 255, 0.05); margin-top: 0.75rem;">
              <button type="button" class="btn btn-outline btn-xs btn-open-detail" data-code="${item.code}" title="Lihat detail lengkap direktif">
                <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                Detail
              </button>
              <button type="button" class="btn btn-primary btn-xs btn-add-from-catalog" data-code="${item.code}">
                + Tambah ke Prompt
              </button>
            </div>
          </div>
        `;
      }).join('')
    : '<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-muted);"><p>Tidak ada shorthand yang cocok dengan kriteria filter &amp; pencarian semantik.</p></div>';

  // 6. Pagination Controls Html
  const paginationHtml = totalPages > 1 ? `
    <div class="catalog-pagination">
      <button type="button" class="pagination-btn btn-prev-page" ${validPage <= 1 ? 'disabled' : ''}>
        &larr; Sebelumnya
      </button>
      <span class="pagination-page-indicator">
        Halaman ${validPage} dari ${totalPages} (${totalItems} Shorthand)
      </span>
      <button type="button" class="pagination-btn btn-next-page" ${validPage >= totalPages ? 'disabled' : ''}>
        Berikutnya &rarr;
      </button>
    </div>
  ` : '';

  // 7. Modal Detail Shorthand
  let modalHtml = '';
  if (selectedDetailCode) {
    const detailItem = catalog.find(c => c.code === selectedDetailCode);
    if (detailItem) {
      modalHtml = `
        <div class="modal-backdrop" id="modal-detail-backdrop">
          <div class="modal-card" style="max-width: 680px;" role="dialog" aria-modal="true">
            <div class="modal-header">
              <div>
                <span class="catalog-item-code" style="font-size: 1.35rem;">${detailItem.code}</span>
                <h3 style="font-size: 1rem; color: #ffffff; margin-top: 0.2rem;">${detailItem.name}</h3>
              </div>
              <button type="button" class="modal-close" id="btn-close-detail-modal" aria-label="Tutup">&times;</button>
            </div>

            <div class="modal-body" style="display: flex; flex-direction: column; gap: 1rem; max-height: 70vh; overflow-y: auto;">
              <!-- Meta Row -->
              <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <span class="badge badge-neutral">Sumber: ${detailItem.source || 'CORE'}</span>
                <span class="badge badge-blue">Kategori: ${detailItem.category}</span>
                <span class="badge badge-purple">Target: ${detailItem.target}</span>
                <span class="badge badge-wajib">Level: ${detailItem.recommendationLevel || detailItem.priority}</span>
                ${detailItem.preferredRepresentative ? '<span class="badge badge-blue font-mono">REPRESENTATIF UTAMA</span>' : ''}
              </div>

              <!-- Function Group & Equivalents -->
              <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-card); padding: 0.75rem; border-radius: var(--radius-sm);">
                <div style="font-size: 0.8rem; color: var(--text-muted);">
                  <strong>Function Group:</strong> <span style="color: #c084fc;">${detailItem.functionGroup || '-'}</span>
                </div>
                ${detailItem.equivalentTo && detailItem.equivalentTo.length > 0 ? `
                  <div style="margin-top: 0.4rem; font-size: 0.8rem;">
                    <strong>Alias Setara (Equivalent To):</strong>
                    <div style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.25rem;">
                      ${detailItem.equivalentTo.map(eq => `<span class="alias-tag font-mono">${eq}</span>`).join('')}
                    </div>
                  </div>
                ` : ''}
              </div>

              <!-- Relationships List -->
              ${detailItem.relationships && detailItem.relationships.length > 0 ? `
                <div>
                  <span class="detail-label" style="color: #a78bfa;">RELASI SEMANTIK TERKAIT:</span>
                  <div style="display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.35rem;">
                    ${detailItem.relationships.map(r => `
                      <div style="background: rgba(139, 92, 246, 0.08); border-left: 3px solid #8b5cf6; padding: 0.4rem 0.65rem; border-radius: 4px; font-size: 0.8rem;">
                        <span class="font-mono" style="color: #c4b5fd; font-weight: 700;">${r.code}</span>
                        <span class="badge badge-purple" style="font-size: 0.65rem; margin-left: 0.35rem;">${r.relationType}</span>
                        <div style="color: #cbd5e1; font-size: 0.75rem; margin-top: 0.2rem;">${r.reason}</div>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Deskripsi -->
              <div>
                <span class="detail-label">DESKRIPSI:</span>
                <p class="detail-value" style="margin-top: 0.25rem;">${detailItem.description}</p>
              </div>

              <!-- Kapan Digunakan -->
              <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid #10b981; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
                <strong style="color: #6ee7b7; font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">KAPAN DIGUNAKAN:</strong>
                <p style="font-size: 0.825rem; color: #e2e8f0;">${detailItem.whenToUse || 'Sesuai dengan instruksi user yang relevan.'}</p>
              </div>

              <!-- Kapan Tidak Digunakan -->
              <div style="background: rgba(239, 68, 68, 0.08); border-left: 3px solid #ef4444; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm);">
                <strong style="color: #fca5a5; font-size: 0.8rem; display: block; margin-bottom: 0.2rem;">KAPAN TIDAK DIGUNAKAN:</strong>
                <p style="font-size: 0.825rem; color: #e2e8f0;">${detailItem.whenNotToUse || 'Jika bertentangan dengan preferensi user.'}</p>
              </div>

              <!-- Semantic Triggers -->
              <div>
                <span class="detail-label">SEMANTIC TRIGGERS:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.35rem;">
                  ${(detailItem.semanticTriggers || []).map(t => `<span class="compat-pill">"${t}"</span>`).join('')}
                </div>
              </div>

              <!-- Conflicts & Compatible -->
              <div class="grid-2" style="margin-top: 0.25rem;">
                <div>
                  <span class="detail-label" style="color: #f87171;">CONFLICTS:</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.35rem;">
                    ${detailItem.conflicts && detailItem.conflicts.length > 0
                      ? detailItem.conflicts.map(c => `<span class="conflict-pill">${c}</span>`).join('')
                      : '<span style="color: var(--text-dim); font-size: 0.8rem;">Tidak ada</span>'}
                  </div>
                </div>
                <div>
                  <span class="detail-label" style="color: #60a5fa;">COMPATIBLE WITH:</span>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.35rem;">
                    ${detailItem.compatibleWith && detailItem.compatibleWith.length > 0
                      ? detailItem.compatibleWith.map(c => `<span class="compat-pill">${c}</span>`).join('')
                      : '<span style="color: var(--text-dim); font-size: 0.8rem;">Semua shorthand standar</span>'}
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1.25rem; border-top: 1px solid var(--border-card);">
              <button type="button" class="btn btn-outline btn-sm" id="btn-close-detail-footer">Tutup</button>
              <button type="button" class="btn btn-primary btn-sm btn-add-from-modal" data-code="${detailItem.code}">
                + Tambah ${detailItem.code} ke Prompt
              </button>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 8. Modal Add Shorthand
  let addModalHtml = '';
  if (isAddModalOpen) {
    const funcGroupKeys = Object.keys(FUNCTION_GROUPS);
    addModalHtml = `
      <div class="modal-backdrop" id="modal-add-backdrop">
        <div class="modal-card" style="max-width: 620px;" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.1rem; color: #ffffff;">+ Tambah Shorthand Baru (User Catalog)</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                Tersimpan permanen di browser (IndexedDB). Tidak akan terhapus saat Analyzer di-reset.
              </p>
            </div>
            <button type="button" class="modal-close" id="btn-close-add-modal" aria-label="Tutup">&times;</button>
          </div>

          <form id="form-add-shorthand">
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.85rem; max-height: 65vh; overflow-y: auto;">
              ${duplicateWarning ? `
                <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: var(--radius-sm); padding: 0.75rem;">
                  <strong style="color: #fbbf24; font-size: 0.85rem; display: block; margin-bottom: 0.25rem;">
                    ⚠️ FUNGSI SERUPA TERDETEKSI:
                  </strong>
                  <p style="font-size: 0.8rem; color: #fde68a; margin: 0;">${duplicateWarning.message}</p>
                  <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.35rem;">
                    Disarankan menambahkan kode ini sebagai <em>Alias Setara (Equivalent To)</em> atau klik Simpan Kembali jika tetap ingin membuat entri baru.
                  </p>
                </div>
              ` : ''}

              <div class="grid-2">
                <div>
                  <label class="detail-label" for="add-code">KODE SHORTHAND *</label>
                  <input type="text" id="add-code" class="input-primary" placeholder="/customtag" required style="width: 100%; margin-top: 0.25rem;" />
                </div>
                <div>
                  <label class="detail-label" for="add-name">NAMA SHORTHAND *</label>
                  <input type="text" id="add-name" class="input-primary" placeholder="Nama representatif" required style="width: 100%; margin-top: 0.25rem;" />
                </div>
              </div>

              <div class="grid-2">
                <div>
                  <label class="detail-label" for="add-category">KATEGORI *</label>
                  <select id="add-category" class="select-input" style="width: 100%; margin-top: 0.25rem;">
                    ${Object.keys(SHORTHAND_CATEGORIES).map(k => `<option value="${k}">${k} - ${SHORTHAND_CATEGORIES[k].label}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="detail-label" for="add-target">TARGET AREA *</label>
                  <input type="text" id="add-target" class="input-primary" placeholder="Misal: Wajah, Pakaian, Latar" required style="width: 100%; margin-top: 0.25rem;" />
                </div>
              </div>

              <div>
                <label class="detail-label" for="add-func-group">FUNCTION GROUP (SEMANTIC DEDUPLICATION) *</label>
                <input type="text" id="add-func-group" class="input-primary" placeholder="Misal: CUSTOM_ACTION atau pilih group standar" list="list-func-groups" style="width: 100%; margin-top: 0.25rem;" />
                <datalist id="list-func-groups">
                  ${funcGroupKeys.map(k => `<option value="${k}">`).join('')}
                </datalist>
              </div>

              <div>
                <label class="detail-label" for="add-desc">DESKRIPSI *</label>
                <textarea id="add-desc" class="input-primary" rows="2" placeholder="Fungsi dan cara kerja shorthand ini..." required style="width: 100%; margin-top: 0.25rem;"></textarea>
              </div>

              <div>
                <label class="detail-label" for="add-triggers">SEMANTIC TRIGGERS (Pisahkan dengan koma)</label>
                <input type="text" id="add-triggers" class="input-primary" placeholder="kata kunci 1, kata kunci 2, pemicu semantik" style="width: 100%; margin-top: 0.25rem;" />
              </div>

              <div>
                <label class="detail-label" for="add-equivalent">ALIAS SETARA (EQUIVALENT TO, pisahkan dengan koma)</label>
                <input type="text" id="add-equivalent" class="input-primary" placeholder="/alias1, /alias2" style="width: 100%; margin-top: 0.25rem;" />
              </div>
            </div>

            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.85rem 1.25rem; border-top: 1px solid var(--border-card);">
              <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-add">Batal</button>
              <button type="submit" class="btn btn-primary btn-sm">Simpan Shorthand</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // 9. Modal Import JSON
  let importModalHtml = '';
  if (isImportModalOpen) {
    importModalHtml = `
      <div class="modal-backdrop" id="modal-import-backdrop">
        <div class="modal-card" style="max-width: 580px;" role="dialog" aria-modal="true">
          <div class="modal-header">
            <div>
              <h3 style="font-size: 1.1rem; color: #ffffff;">⬆️ Impor Katalog (JSON)</h3>
              <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">
                Impor data shorthand. Format JSON aman tanpa API key atau kredensial rahasia.
              </p>
            </div>
            <button type="button" class="modal-close" id="btn-close-import-modal" aria-label="Tutup">&times;</button>
          </div>

          <form id="form-import-catalog">
            <div class="modal-body" style="display: flex; flex-direction: column; gap: 0.85rem;">
              <div>
                <label class="detail-label">MODE IMPOR:</label>
                <div style="display: flex; gap: 1rem; margin-top: 0.35rem;">
                  <label style="font-size: 0.825rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                    <input type="radio" name="import-mode" value="MERGE" checked />
                    <strong>MERGE</strong> (Gabungkan tanpa menimpa CORE)
                  </label>
                  <label style="font-size: 0.825rem; color: #e2e8f0; display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                    <input type="radio" name="import-mode" value="REPLACE" />
                    <strong>REPLACE</strong> (Ganti User Catalog)
                  </label>
                </div>
              </div>

              <div>
                <label class="detail-label" for="import-json-textarea">PASTE JSON ATAU PILIH FILE:</label>
                <textarea id="import-json-textarea" class="input-primary font-mono" rows="6" placeholder='{ "catalogVersion": "2.1", "entries": [...] }' style="width: 100%; margin-top: 0.25rem; font-size: 0.775rem;"></textarea>
              </div>

              <div>
                <input type="file" id="import-file-input" accept=".json" style="font-size: 0.8rem; color: var(--text-muted);" />
              </div>
            </div>

            <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 0.5rem; padding: 0.85rem 1.25rem; border-top: 1px solid var(--border-card);">
              <button type="button" class="btn btn-outline btn-sm" id="btn-cancel-import">Batal</button>
              <button type="submit" class="btn btn-primary btn-sm">Mulai Impor</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // --- HTML Page Output ---
  const html = `
    <section class="panel">
      <!-- Page Header -->
      <div class="card-header">
        <div>
          <h2 style="font-size: 1.25rem;">SEMANTIC SHORTHAND KNOWLEDGE BASE</h2>
          <p style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.2rem;">
            Basis pengetahuan semantik shorthand yang terintegrasi langsung dengan Semantic Engine, Deduplikasi Fungsi, dan Relasi Antar-Domain.
          </p>
        </div>
        <span class="badge badge-blue font-mono">${catalog.length} Shorthand Terdaftar</span>
      </div>

      <!-- Action Bar: Add, Export, Import, Reset User Catalog -->
      <div class="catalog-action-bar">
        <div style="font-size: 0.825rem; color: var(--text-muted);">
          CORE CATALOG: <strong>Read-Only</strong> &bull; USER CATALOG: <strong>IndexedDB Persistent</strong>
        </div>
        <div class="catalog-actions-group">
          <button type="button" class="btn btn-primary btn-xs" id="btn-open-add-shorthand">
            + Tambah Shorthand
          </button>
          <button type="button" class="btn btn-outline btn-xs" id="btn-export-catalog" title="Download sanitized catalog JSON">
            ⬇️ Ekspor JSON
          </button>
          <button type="button" class="btn btn-outline btn-xs" id="btn-open-import-catalog" title="Import catalog JSON">
            ⬆️ Impor JSON
          </button>
          <button type="button" class="btn btn-danger btn-xs" id="btn-reset-user-catalog" title="Reset hanya entri user, core tetap utuh">
            🔄 Reset User Katalog
          </button>
        </div>
      </div>

      <!-- Category Filter Tabs -->
      <div class="category-tabs" id="catalog-category-tabs" style="margin-bottom: 1rem;">
        ${categoryTabsHtml}
      </div>

      <!-- Secondary Filter & Search Bar -->
      <div class="catalog-controls" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.25rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center;">
          <!-- Filter Target -->
          <select id="select-filter-target" class="select-input" style="padding: 0.45rem 0.75rem;">
            <option value="ALL">-- Semua Target Area --</option>
            ${targetOptions.map(t => `<option value="${t}" ${activeTarget === t ? 'selected' : ''}>Target: ${t}</option>`).join('')}
          </select>

          <!-- Filter Recommendation Level -->
          <select id="select-filter-rec-level" class="select-input" style="padding: 0.45rem 0.75rem;">
            <option value="ALL">-- Semua Level Rekomendasi --</option>
            <option value="WAJIB" ${activeRecLevel === 'WAJIB' ? 'selected' : ''}>Level: WAJIB</option>
            <option value="DISARANKAN" ${activeRecLevel === 'DISARANKAN' ? 'selected' : ''}>Level: DISARANKAN</option>
            <option value="OPSIONAL" ${activeRecLevel === 'OPSIONAL' ? 'selected' : ''}>Level: OPSIONAL</option>
          </select>
        </div>

        <!-- Semantic Search Input -->
        <div style="flex: 1; max-width: 380px; min-width: 250px;">
          <input 
            type="search" 
            id="catalog-search-input" 
            class="search-input" 
            placeholder="Cari semantik: misal 'jangan ubah wajah', 'ganti baju', 'latar baru'..."
            value="${searchQuery || ''}"
          />
        </div>
      </div>

      <!-- Grid of Shorthands -->
      <div class="catalog-cards-grid">
        ${cardsHtml}
      </div>

      <!-- Pagination -->
      ${paginationHtml}

      <!-- Modals -->
      ${modalHtml}
      ${addModalHtml}
      ${importModalHtml}
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      // Category tabs
      container.querySelectorAll('.category-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.getAttribute('data-cat');
          if (onSelectCategory) onSelectCategory(cat);
        });
      });

      // Target filter
      const targetSelect = container.querySelector('#select-filter-target');
      if (targetSelect) {
        targetSelect.addEventListener('change', (e) => {
          if (onSelectTarget) onSelectTarget(e.target.value);
        });
      }

      // Recommendation level filter
      const recLevelSelect = container.querySelector('#select-filter-rec-level');
      if (recLevelSelect) {
        recLevelSelect.addEventListener('change', (e) => {
          if (onSelectRecLevel) onSelectRecLevel(e.target.value);
        });
      }

      // Search input
      const searchInput = container.querySelector('#catalog-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          if (onSearchChange) onSearchChange(e.target.value);
        });
      }

      // Pagination events
      const prevBtn = container.querySelector('.btn-prev-page');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (onPageChange) onPageChange(validPage - 1);
        });
      }
      const nextBtn = container.querySelector('.btn-next-page');
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (onPageChange) onPageChange(validPage + 1);
        });
      }

      // Action bar buttons
      const btnOpenAdd = container.querySelector('#btn-open-add-shorthand');
      if (btnOpenAdd && onOpenAddModal) {
        btnOpenAdd.addEventListener('click', onOpenAddModal);
      }

      const btnExport = container.querySelector('#btn-export-catalog');
      if (btnExport && onExportCatalog) {
        btnExport.addEventListener('click', onExportCatalog);
      }

      const btnOpenImport = container.querySelector('#btn-open-import-catalog');
      if (btnOpenImport && onOpenImportModal) {
        btnOpenImport.addEventListener('click', onOpenImportModal);
      }

      const btnResetUser = container.querySelector('#btn-reset-user-catalog');
      if (btnResetUser && onResetUserCatalog) {
        btnResetUser.addEventListener('click', onResetUserCatalog);
      }

      // Open detail modal
      container.querySelectorAll('.btn-open-detail').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-code');
          if (onOpenDetail) onOpenDetail(code);
        });
      });

      // Close detail modal
      const closeBtn = container.querySelector('#btn-close-detail-modal');
      const closeFooterBtn = container.querySelector('#btn-close-detail-footer');
      const backdrop = container.querySelector('#modal-detail-backdrop');

      const closeHandler = () => {
        if (onCloseDetail) onCloseDetail();
      };

      if (closeBtn) closeBtn.addEventListener('click', closeHandler);
      if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeHandler);
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) closeHandler();
        });
      }

      // Close Add Modal
      const closeAddBtn = container.querySelector('#btn-close-add-modal');
      const cancelAddBtn = container.querySelector('#btn-cancel-add');
      const addBackdrop = container.querySelector('#modal-add-backdrop');
      const addCloseHandler = () => {
        if (onCloseAddModal) onCloseAddModal();
      };
      if (closeAddBtn) closeAddBtn.addEventListener('click', addCloseHandler);
      if (cancelAddBtn) cancelAddBtn.addEventListener('click', addCloseHandler);
      if (addBackdrop) {
        addBackdrop.addEventListener('click', (e) => {
          if (e.target === addBackdrop) addCloseHandler();
        });
      }

      // Submit Add Shorthand
      const formAdd = container.querySelector('#form-add-shorthand');
      if (formAdd && onSubmitAddShorthand) {
        formAdd.addEventListener('submit', (e) => {
          e.preventDefault();
          let code = container.querySelector('#add-code').value.trim();
          if (!code.startsWith('/')) code = '/' + code;
          const name = container.querySelector('#add-name').value.trim();
          const category = container.querySelector('#add-category').value;
          const target = container.querySelector('#add-target').value.trim();
          const functionGroup = container.querySelector('#add-func-group').value.trim() || category;
          const description = container.querySelector('#add-desc').value.trim();
          const triggersRaw = container.querySelector('#add-triggers').value.trim();
          const equivalentRaw = container.querySelector('#add-equivalent').value.trim();

          const semanticTriggers = triggersRaw ? triggersRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
          const equivalentTo = equivalentRaw ? equivalentRaw.split(',').map(s => s.trim().startsWith('/') ? s.trim() : '/' + s.trim()).filter(Boolean) : [];

          onSubmitAddShorthand({
            code,
            name,
            category,
            target,
            functionGroup,
            description,
            semanticTriggers,
            equivalentTo,
            status: 'CUSTOM',
            source: 'USER',
            priority: 'MEDIUM',
            recommendationLevel: 'DISARANKAN',
            whenToUse: `Digunakan saat prompt meminta ${target.toLowerCase()}.`,
            whenNotToUse: `Hindari jika bertentangan dengan preferensi user.`,
            negativeTriggers: [],
            conflicts: [],
            compatibleWith: []
          });
        });
      }

      // Close Import Modal
      const closeImportBtn = container.querySelector('#btn-close-import-modal');
      const cancelImportBtn = container.querySelector('#btn-cancel-import');
      const importBackdrop = container.querySelector('#modal-import-backdrop');
      const importCloseHandler = () => {
        if (onCloseImportModal) onCloseImportModal();
      };
      if (closeImportBtn) closeImportBtn.addEventListener('click', importCloseHandler);
      if (cancelImportBtn) cancelImportBtn.addEventListener('click', importCloseHandler);
      if (importBackdrop) {
        importBackdrop.addEventListener('click', (e) => {
          if (e.target === importBackdrop) importCloseHandler();
        });
      }

      // File input handler for import
      const fileInput = container.querySelector('#import-file-input');
      const jsonTextarea = container.querySelector('#import-json-textarea');
      if (fileInput && jsonTextarea) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (evt) => {
              jsonTextarea.value = evt.target.result;
            };
            reader.readAsText(file);
          }
        });
      }

      // Submit Import
      const formImport = container.querySelector('#form-import-catalog');
      if (formImport && onSubmitImport) {
        formImport.addEventListener('submit', (e) => {
          e.preventDefault();
          const mode = container.querySelector('input[name="import-mode"]:checked')?.value || 'MERGE';
          const jsonText = container.querySelector('#import-json-textarea')?.value?.trim();
          onSubmitImport(jsonText, mode);
        });
      }

      // Add shorthand to prompt from card
      container.querySelectorAll('.btn-add-from-catalog').forEach(btn => {
        btn.addEventListener('click', () => {
          const code = btn.getAttribute('data-code');
          if (onAddShorthandToPrompt) onAddShorthandToPrompt(code);
        });
      });

      // Add shorthand to prompt from modal
      const modalAddBtn = container.querySelector('.btn-add-from-modal');
      if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
          const code = modalAddBtn.getAttribute('data-code');
          if (onAddShorthandToPrompt) onAddShorthandToPrompt(code);
          closeHandler();
        });
      }
    }
  };
}
