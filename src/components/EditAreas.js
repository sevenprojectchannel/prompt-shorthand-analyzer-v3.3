/**
 * EditAreas Component V2
 * Menampilkan elemen atau area visual yang secara eksplisit diminta untuk diubah.
 */

export function renderEditAreas(editAreas = []) {
  const content = editAreas.length > 0
    ? editAreas.map(item => `
        <div class="area-item-card area-edit">
          <div class="area-icon-col">
            <span class="badge badge-purple">${item.entity}</span>
          </div>
          <div class="area-content-col">
            <div class="area-title-row">
              <span class="area-title">${item.label}</span>
              ${item.shorthand ? `<span class="badge badge-blue font-mono">${item.shorthand}</span>` : ''}
            </div>
            <p class="area-desc">${item.description}</p>
          </div>
        </div>
      `).join('')
    : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">Tidak ada area spesifik yang diubah, atau prompt belum dianalisis.</div>';

  const html = `
    <section class="panel analyzer-card" id="card-edit-areas">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge">B</span>
          <h2>AREA YANG DIUBAH</h2>
        </div>
        <span class="badge badge-purple">${editAreas.length} Terdeteksi</span>
      </div>

      <div class="areas-grid-container">
        ${content}
      </div>
    </section>
  `;

  return { html, bindEvents() {} };
}
