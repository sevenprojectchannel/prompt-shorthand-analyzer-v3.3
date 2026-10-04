/**
 * InstalledShorthands Component V2
 * Manajemen shorthand aktif yang terpasang pada Prompt Optimal.
 * User dapat menghapus atau menambahkan shorthand secara manual,
 * yang secara real-time memperbarui Prompt Optimal.
 */

export function renderInstalledShorthands({
  installedShorthands = [],
  catalog = [],
  onRemoveShorthand,
  onAddShorthand
}) {
  const chipsHtml = installedShorthands.length > 0
    ? installedShorthands.map(code => `
        <span class="shorthand-chip" data-code="${code}">
          <span>${code}</span>
          <button type="button" class="chip-remove-btn" data-code="${code}" title="Hapus ${code}">&times;</button>
        </span>
      `).join('')
    : '<span style="font-size: 0.8rem; color: var(--text-dim); font-style: italic;">Belum ada shorthand terpasang</span>';

  // Available catalog items not already installed
  const availableOptions = catalog
    .filter(item => !installedShorthands.includes(item.code))
    .map(item => `
      <option value="${item.code}">${item.code} - ${item.name}</option>
    `).join('');

  const html = `
    <div class="installed-shorthands-bar">
      <div class="installed-title-row">
        <span style="font-size: 0.8rem; font-weight: 700; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.04em;">
          Shorthand Terpasang:
        </span>

        <!-- Add shorthand selector from catalog -->
        <div class="add-shorthand-controls">
          <select id="select-catalog-shorthand" class="select-input">
            <option value="">-- Pilih Shorthand dari Catalog --</option>
            ${availableOptions}
          </select>
          <button type="button" class="btn btn-secondary btn-xs" id="btn-add-shorthand" title="Pasang shorthand ke prompt">
            + Tambah
          </button>
        </div>
      </div>

      <div class="installed-chips-container" id="installed-chips-list">
        ${chipsHtml}
      </div>
    </div>
  `;

  return {
    html,
    bindEvents(container) {
      container.querySelectorAll('.chip-remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const code = btn.getAttribute('data-code');
          if (onRemoveShorthand) onRemoveShorthand(code);
        });
      });

      const addBtn = container.querySelector('#btn-add-shorthand');
      const select = container.querySelector('#select-catalog-shorthand');

      if (addBtn && select) {
        addBtn.addEventListener('click', () => {
          const selectedCode = select.value;
          if (selectedCode && onAddShorthand) {
            onAddShorthand(selectedCode);
          }
        });
      }
    }
  };
}
