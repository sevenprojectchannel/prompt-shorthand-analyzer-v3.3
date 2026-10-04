/**
 * ExcludedShorthands Component V3
 * Menampilkan shorthand yang TIDAK diperlukan (dikecualikan) disertai alasan rasional.
 * Dilengkapi fitur Show/Hide dengan DEFAULT HIDE agar tidak mengambil ruang tampilan utama.
 */

export function renderExcludedShorthands(exclusions = []) {
  const count = exclusions.length;
  const items = count > 0
    ? exclusions.map(ex => `
        <div class="exclusion-item">
          <div class="exclusion-code-row">
            <span class="exclusion-code">${ex.code}</span>
            <span class="exclusion-target">&bull; ${ex.target}</span>
          </div>
          <p class="exclusion-reason">
            ${ex.reason}
          </p>
        </div>
      `).join('')
    : '<div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; padding: 0.5rem 0;">Tidak ada shorthand yang dikecualikan.</div>';

  const html = `
    <section class="panel analyzer-card" id="card-exclusions">
      <div class="card-header exclusions-toggle-header" id="header-exclusions" role="button" tabindex="0" title="Klik untuk menampilkan atau menyembunyikan daftar pengecualian">
        <div class="card-title">
          <span class="card-step-badge">H</span>
          <h2>SHORTHAND TIDAK DIPERLUKAN (DIKECUALIKAN)</h2>
        </div>
        <div class="exclusions-header-actions" style="display: flex; align-items: center; gap: 0.6rem;">
          <span class="badge badge-neutral">${count} Dikecualikan</span>
          <button type="button" class="btn btn-secondary btn-xs btn-toggle-exclusions" id="btn-toggle-exclusions" aria-expanded="false" title="Tampilkan / Sembunyikan daftar">
            <svg class="icon-sm icon-eye" viewBox="0 0 24 24" width="14" height="14" style="vertical-align: middle;"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            <span class="toggle-exclusions-text">Tampilkan / Show</span>
          </button>
        </div>
      </div>

      <!-- DEFAULT HIDE: Konten tersembunyi secara default agar tidak mengambil ruang tampilan utama -->
      <div class="exclusions-content" id="exclusions-content" style="display: none;">
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0.75rem 0 0.85rem 0;">
          Engine secara cerdas mengecualikan shorthand di bawah ini karena tidak relevan dengan konteks prompt:
        </p>

        <div class="exclusions-grid">
          ${items}
        </div>
      </div>
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      if (!container) return;
      const toggleBtn = container.querySelector('#btn-toggle-exclusions');
      const content = container.querySelector('#exclusions-content');
      const header = container.querySelector('#header-exclusions');

      if (!toggleBtn || !content) return;

      const toggleAction = (e) => {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        const isCurrentlyHidden = content.style.display === 'none' || !content.style.display;

        if (isCurrentlyHidden) {
          // Tampilkan (Show)
          content.style.display = 'block';
          toggleBtn.setAttribute('aria-expanded', 'true');
          toggleBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" width="14" height="14" style="vertical-align: middle;"><path fill="currentColor" d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
            <span class="toggle-exclusions-text">Sembunyikan / Hide</span>
          `;
          toggleBtn.classList.remove('btn-secondary');
          toggleBtn.classList.add('btn-outline');
        } else {
          // Sembunyikan (Hide)
          content.style.display = 'none';
          toggleBtn.setAttribute('aria-expanded', 'false');
          toggleBtn.innerHTML = `
            <svg class="icon-sm" viewBox="0 0 24 24" width="14" height="14" style="vertical-align: middle;"><path fill="currentColor" d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            <span class="toggle-exclusions-text">Tampilkan / Show</span>
          `;
          toggleBtn.classList.remove('btn-outline');
          toggleBtn.classList.add('btn-secondary');
        }
      };

      toggleBtn.addEventListener('click', toggleAction);

      if (header) {
        header.addEventListener('click', (e) => {
          if (e.target.closest('#btn-toggle-exclusions')) return;
          toggleAction(e);
        });
        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (e.target.closest('#btn-toggle-exclusions')) return;
            toggleAction(e);
          }
        });
      }
    }
  };
}
