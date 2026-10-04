/**
 * ConflictBanner Component V2.1
 * Menampilkan Card G: SHORTHAND KONFLIK (Deteksi konflik semantik antara lock vs edit atau direktif bertentangan).
 */

export function renderConflictBanner(conflicts = [], onResolveConflict) {
  const hasConflicts = conflicts && conflicts.length > 0;

  const conflictsHtml = hasConflicts ? conflicts.map(c => {
    const isLockConflict = c.type === 'EDIT_VS_LOCK' || (c.shorthandA && c.shorthandA.includes('lock'));
    const btn1Label = isLockConflict 
      ? 'Gunakan Instruksi User (Abaikan Kunci)' 
      : `Pilih ${c.shorthandB} (Hapus ${c.shorthandA})`;
    const btn2Label = isLockConflict 
      ? 'Pertahankan Lock (Abaikan Ubah)' 
      : `Pilih ${c.shorthandA} (Hapus ${c.shorthandB})`;

    const suggestionText = c.suggestion || getConflictFallbackSuggestion(c);

    return `
    <div class="conflict-banner" data-conflict-id="${c.id}" style="margin-bottom: 0.75rem;">
      <div class="conflict-header">
        <svg class="icon" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10h2v4h-2zm0 6h2v2h-2z"/></svg>
        <span>DETEKSI KONFLIK &mdash; CONFLICT DETECTED</span>
      </div>

      <div class="conflict-vs-box">
        <span class="conflict-code-badge">${c.shorthandA}</span>
        <span class="conflict-vs-text">VS</span>
        <span class="conflict-code-badge">${c.shorthandB}</span>
      </div>

      <div class="conflict-reason">
        <strong>Alasan:</strong> ${c.reason}
        <br>
        <span style="font-size: 0.8rem; color: #fca5a5;">
          Instruksi A: <em>"${c.instructionA || c.shorthandA}"</em> &bull; 
          Instruksi B: <em>"${c.instructionB || c.shorthandB}"</em>
        </span>
      </div>

      <!-- SARAN SOLUSI KONFLIK -->
      <div class="conflict-suggestion-box">
        <div class="conflict-suggestion-header">
          <svg class="icon-sm" viewBox="0 0 24 24" width="16" height="16" style="vertical-align: middle;"><path fill="currentColor" d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>
          <span>💡 SARAN SOLUSI:</span>
        </div>
        <div class="conflict-suggestion-text">
          ${suggestionText}
        </div>
      </div>

      <div class="conflict-actions">
        <button type="button" class="btn btn-secondary btn-xs btn-resolve" data-action="use_user_edit" data-conflict-id="${c.id}">
          ${btn1Label}
        </button>
        <button type="button" class="btn btn-secondary btn-xs btn-resolve" data-action="keep_lock" data-conflict-id="${c.id}">
          ${btn2Label}
        </button>
        <button type="button" class="btn btn-outline btn-xs btn-resolve" data-action="dismiss" data-conflict-id="${c.id}">
          Abaikan Peringatan
        </button>
      </div>
    </div>
  `;
  }).join('') : '';

  const html = `
    <!-- CARD G: SHORTHAND KONFLIK (CONFLICT DETECTED) -->
    <section class="panel analyzer-card" id="card-conflicts">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge" style="background: ${hasConflicts ? '#dc2626' : 'var(--badge-neutral-bg)'}; color: #fff;">G</span>
          <h2>SHORTHAND KONFLIK</h2>
        </div>
        <span class="badge ${hasConflicts ? 'badge-wajib' : 'badge-neutral'}">
          ${hasConflicts ? `${conflicts.length} Konflik Terdeteksi` : '0 Konflik'}
        </span>
      </div>

      ${hasConflicts ? `
        <p style="font-size: 0.8rem; color: #fca5a5; margin-bottom: 0.85rem;">
          ⚠️ Terdeteksi pertentangan instruksi antara direktif yang diubah dan direktif yang dikunci:
        </p>
        <div class="conflicts-list">
          ${conflictsHtml}
        </div>
      ` : `
        <div style="font-size: 0.85rem; color: #34d399; display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0;">
          <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>Tidak ada konflik direktif yang terdeteksi. Seluruh instruksi prompt konsisten.</span>
        </div>
      `}
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      container.querySelectorAll('.btn-resolve').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.getAttribute('data-action');
          const conflictId = btn.getAttribute('data-conflict-id');
          if (onResolveConflict) {
            onResolveConflict(conflictId, action);
          }
        });
      });
    }
  };
}

/**
 * Fallback jika objek konflik tidak membawa suggestion
 */
function getConflictFallbackSuggestion(c) {
  if (c.suggestion) return c.suggestion;
  const a = c.shorthandA || '';
  const b = c.shorthandB || '';
  if (c.type === 'EDIT_VS_LOCK' || a.includes('lock') || b.includes('lock')) {
    const lockCode = a.includes('lock') ? a : b;
    const editCode = a.includes('lock') ? b : a;
    return `Tentukan prioritas pada area ini: Jika modifikasi baru memang diinginkan, abaikan penguncian (${lockCode}) dan terapkan instruksi ubah (${editCode}). Namun jika tampilan asli wajib dilindungi 100%, pertahankan kunci (${lockCode}) dan batalkan instruksi ubah.`;
  }
  return `Shorthand ${a} dan ${b} memiliki instruksi yang saling meniadakan pada target ${c.entity || 'gambar'}. Disarankan memilih salah satu yang paling mewakili instruksi utama Anda agar hasil generasi AI konsisten dan terhindar dari ambiguitas.`;
}
