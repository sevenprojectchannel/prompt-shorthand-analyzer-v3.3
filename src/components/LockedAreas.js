/**
 * LockedAreas Component V2
 * Menampilkan elemen visual yang dikunci (locked) dan dilindungi dari perubahan.
 */

export function renderLockedAreas(lockedAreas = [], unchangedAreas = []) {
  const lockedContent = lockedAreas.length > 0
    ? lockedAreas.map(item => `
        <div class="area-item-card area-locked">
          <div class="area-icon-col">
            <span class="badge badge-blue">LOCKED: ${item.entity}</span>
          </div>
          <div class="area-content-col">
            <div class="area-title-row">
              <span class="area-title">${item.label}</span>
              ${item.shorthand ? `<span class="badge badge-wajib font-mono">${item.shorthand}</span>` : ''}
            </div>
            <p class="area-desc">${item.description}</p>
          </div>
        </div>
      `).join('')
    : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">Seluruh elemen visual selain instruksi edit dipertahankan secara otomatis.</div>';

  const html = `
    <section class="panel analyzer-card" id="card-locked-areas">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge">C</span>
          <h2>AREA YANG DIPERTAHANKAN / LOCKED</h2>
        </div>
        <span class="badge badge-blue">${lockedAreas.length} Terkunci</span>
      </div>

      <div class="areas-grid-container">
        ${lockedContent}
      </div>
    </section>
  `;

  return { html, bindEvents() {} };
}
