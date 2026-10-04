/**
 * ShorthandRecommendations Component V2.1
 * Memisahkan Rekomendasi menjadi:
 * - Card E: SHORTHAND UTAMA (PRIMARY SHORTHAND) - Mewakili instruksi langsung, aktif otomatis [✓]
 * - Card F: SHORTHAND BERHUBUNGAN (RELATED SHORTHAND) - Discovered via Semantic Graph, nonaktif default [ ]
 * Dilengkapi representasi fungsi (Function Group), alias setara (equivalentTo), status, dan hubungan.
 */

export function renderShorthandRecommendations({
  primaryShorthands = [],
  relatedShorthands = [],
  recommendations = [],
  installedShorthands = [],
  onToggleShorthand
}) {
  // Fallback if primaries/relateds not supplied separately
  const primaries = primaryShorthands.length > 0
    ? primaryShorthands
    : recommendations.filter(r => r.isPrimary !== false && r.priority === 'WAJIB');

  const relateds = relatedShorthands.length > 0
    ? relatedShorthands
    : recommendations.filter(r => r.isPrimary === false || r.priority !== 'WAJIB');

  // --- 1. CARD E: SHORTHAND UTAMA ---
  const primaryItemsHtml = primaries.length > 0
    ? primaries.map(rec => {
        const isInstalled = installedShorthands.includes(rec.code);
        const equivalentList = rec.equivalentTo || rec.item?.equivalentTo || [];
        const funcGroup = rec.functionGroup || rec.item?.functionGroup || rec.category;

        return `
          <div class="rec-card primary-rec-card ${isInstalled ? 'rec-card-active' : ''}" data-code="${rec.code}">
            <div>
              <div class="rec-card-header">
                <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                  <span class="rec-code" style="color: #60a5fa; font-size: 1rem; font-weight: 800;">✓ ${rec.code}</span>
                  <span class="badge badge-wajib">WAJIB</span>
                  <span class="badge badge-blue font-mono" style="font-size: 0.675rem;">REPRESENTATIF UTAMA</span>
                  ${(rec.source === 'ONLINE' || rec.isOnline) ? '<span class="badge badge-online">🌐 ONLINE</span>' : ''}
                </div>
                <span class="badge badge-neutral" style="font-size: 0.7rem;">${rec.category}</span>
              </div>

              <div class="related-fields" style="margin-top: 0.65rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.825rem;">
                <div><strong style="color: var(--text-muted);">Nama:</strong> <span style="color: #f8fafc; font-weight: 600;">${rec.name}</span></div>
                <div><strong style="color: var(--text-muted);">Target:</strong> <span style="color: #93c5fd;">${rec.target}</span></div>
                <div><strong style="color: var(--text-muted);">Fungsi:</strong> <span style="color: #c084fc;">${funcGroup}</span></div>
                <div><strong style="color: var(--text-muted);">Alasan:</strong> <span style="color: #cbd5e1;">${rec.reason}</span></div>
                <div><strong style="color: var(--text-muted);">Status:</strong> <span style="color: #34d399;">${(rec.source === 'ONLINE' || rec.isOnline) ? 'ONLINE' : (rec.item?.status || 'CORE')}</span></div>
                ${equivalentList.length > 0 ? `
                  <div style="margin-top: 0.2rem;">
                    <strong style="color: var(--text-muted);">Alias Setara:</strong>
                    ${equivalentList.map(eq => `<span class="alias-tag font-mono">${eq}</span>`).join(' ')}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="rec-toggle-row" style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.75rem; color: ${isInstalled ? '#34d399' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.35rem;">
                ${isInstalled ? '✅ Aktif Otomatis di Prompt Optimal' : '⚠️ Dilepas dari Prompt'}
              </span>
              <button 
                type="button" 
                class="btn ${isInstalled ? 'btn-danger' : 'btn-primary'} btn-xs btn-toggle-rec" 
                data-code="${rec.code}"
                title="${isInstalled ? 'Lepas shorthand dari prompt optimal' : 'Pasang kembali ke prompt optimal'}"
              >
                ${isInstalled ? 'Lepas' : '+ Pasang'}
              </button>
            </div>
          </div>
        `;
      }).join('')
    : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 1rem 0;">Tidak ada shorthand utama langsung yang terdeteksi dari prompt ini.</div>';

  // --- 2. CARD F: SHORTHAND BERHUBUNGAN ---
  const relatedItemsHtml = relateds.length > 0
    ? relateds.map(rec => {
        const isInstalled = installedShorthands.includes(rec.code);
        const equivalentList = rec.equivalentTo || rec.item?.equivalentTo || [];
        const relType = rec.relationship || 'CONTEXTUAL';
        const sourceBadge = rec.source === 'USER' ? 'badge-purple' : 'badge-neutral';

        return `
          <div class="rec-card related-rec-card ${isInstalled ? 'rec-card-active' : ''}" data-code="${rec.code}">
            <div class="related-item-content">
              <div class="related-header-row" style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; flex-wrap: wrap;">
                <label class="checkbox-container" style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; user-select: none;">
                  <input 
                    type="checkbox" 
                    class="related-checkbox" 
                    data-code="${rec.code}" 
                    ${isInstalled ? 'checked' : ''} 
                    style="width: 1.15rem; height: 1.15rem; cursor: pointer; accent-color: #8b5cf6;"
                  />
                  <span class="rec-code" style="color: #a78bfa; font-size: 1rem; font-weight: 800;">${rec.code}</span>
                </label>
                <div style="display: flex; gap: 0.35rem; align-items: center;">
                  <span class="badge badge-purple" style="font-size: 0.675rem;">${relType}</span>
                  ${(rec.source === 'ONLINE' || rec.isOnline) ? '<span class="badge badge-online" style="font-size: 0.675rem;">🌐 ONLINE</span>' : `<span class="badge ${sourceBadge}" style="font-size: 0.675rem;">${rec.source || 'CORE'}</span>`}
                  <span class="badge badge-neutral" style="font-size: 0.7rem;">${rec.category}</span>
                </div>
              </div>

              <div class="related-fields" style="margin-top: 0.65rem; display: flex; flex-direction: column; gap: 0.35rem; font-size: 0.825rem;">
                <div><strong style="color: var(--text-muted);">Nama:</strong> <span style="color: #f8fafc; font-weight: 600;">${rec.name}</span></div>
                <div><strong style="color: var(--text-muted);">Target:</strong> <span style="color: #93c5fd;">${rec.target}</span></div>
                <div><strong style="color: var(--text-muted);">Relationship:</strong> <span style="color: #c084fc; font-weight: 600;">${relType}</span></div>
                <div><strong style="color: var(--text-muted);">Alasan:</strong> <span style="color: #cbd5e1;">${rec.reason}</span></div>
                <div><strong style="color: var(--text-muted);">Source:</strong> <span style="color: #34d399;">${(rec.source === 'ONLINE' || rec.isOnline) ? 'ONLINE' : (rec.source || 'CORE')}</span></div>
                ${equivalentList.length > 0 ? `
                  <div style="margin-top: 0.2rem;">
                    <strong style="color: var(--text-muted);">Alias Setara:</strong>
                    ${equivalentList.map(eq => `<span class="alias-tag font-mono">${eq}</span>`).join(' ')}
                  </div>
                ` : ''}
              </div>
            </div>

            <div class="rec-toggle-row" style="margin-top: 0.75rem; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 0.75rem; color: ${isInstalled ? '#34d399' : 'var(--text-muted)'}; display: flex; align-items: center; gap: 0.35rem;">
                ${isInstalled ? '✅ Dicentang (Terpasang di Prompt)' : '⚪ Nonaktif (Belum Dicentang)'}
              </span>
              <button 
                type="button" 
                class="btn ${isInstalled ? 'btn-danger' : 'btn-outline'} btn-xs btn-toggle-rec" 
                data-code="${rec.code}"
                title="${isInstalled ? 'Lepas dari prompt optimal' : 'Centang dan pasang ke prompt optimal'}"
              >
                ${isInstalled ? 'Batal Centang' : '+ Centang & Pasang'}
              </button>
            </div>
          </div>
        `;
      }).join('')
    : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 1rem 0;">Tidak ada shorthand berhubungan yang relevan.</div>';

  const html = `
    <!-- CARD E: SHORTHAND UTAMA (PRIMARY SHORTHAND) -->
    <section class="panel analyzer-card" id="card-primary-shorthands">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge">E</span>
          <h2>SHORTHAND UTAMA (PRIMARY SHORTHAND)</h2>
        </div>
        <span class="badge badge-blue">${primaries.length} Aktif Otomatis</span>
      </div>

      <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.85rem;">
        Mewakili instruksi langsung dari prompt user. Otomatis terpasang [✓] dan masuk ke Prompt Optimal dengan deduplikasi fungsi terbaik.
      </p>

      <div class="rec-grid">
        ${primaryItemsHtml}
      </div>
    </section>

    <!-- CARD F: SHORTHAND BERHUBUNGAN (RELATED SHORTHAND) -->
    <section class="panel analyzer-card" id="card-related-shorthands">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge">F</span>
          <h2>SHORTHAND BERHUBUNGAN (RELATED SHORTHAND)</h2>
        </div>
        <span class="badge badge-purple">${relateds.length} Rekomendasi Terhubung</span>
      </div>

      <p style="font-size: 0.825rem; color: var(--text-muted); margin-bottom: 0.85rem;">
        Ditemukan dari Semantic Graph dan relasi kontekstual antar-domain. Semua checkbox secara default <strong>OFF [ ]</strong>. Ceklis checkbox atau klik <strong>+ Centang &amp; Pasang</strong> untuk memasukkannya ke Prompt Optimal.
      </p>

      <div class="rec-grid">
        ${relatedItemsHtml}
      </div>
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      container.querySelectorAll('.btn-toggle-rec').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const code = btn.getAttribute('data-code');
          if (onToggleShorthand) {
            onToggleShorthand(code);
          }
        });
      });

      container.querySelectorAll('.related-checkbox').forEach(chk => {
        chk.addEventListener('change', (e) => {
          e.stopPropagation();
          const code = chk.getAttribute('data-code');
          if (onToggleShorthand) {
            onToggleShorthand(code);
          }
        });
      });
    }
  };
}
