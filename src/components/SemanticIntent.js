/**
 * SemanticIntent Component V2
 * Menampilkan maksud semantik prompt dalam bahasa Indonesia yang jelas.
 */

export function renderSemanticIntent(intentData) {
  const {
    primaryAction = '-',
    primaryTarget = '-',
    summary = 'Prompt belum dianalisis. Masukkan prompt di atas untuk memulai.',
    priority = '-',
    category = '-'
  } = intentData || {};

  const html = `
    <section class="panel analyzer-card" id="card-intent">
      <div class="card-header">
        <div class="card-title">
          <span class="card-step-badge">A</span>
          <h2>MAKSUD PROMPT</h2>
        </div>
      </div>

      <div class="intent-summary-box">
        <strong>Ringkasan Semantik:</strong>
        <p style="margin-top: 0.35rem; color: #f1f5f9;">${summary}</p>
      </div>

      <div class="intent-grid">
        <div class="intent-meta-card">
          <span class="intent-meta-label">INTENT</span>
          <span class="intent-meta-value">${primaryAction}</span>
        </div>
        <div class="intent-meta-card">
          <span class="intent-meta-label">TARGET AREA</span>
          <span class="intent-meta-value">${primaryTarget}</span>
        </div>
        <div class="intent-meta-card">
          <span class="intent-meta-label">KATEGORI</span>
          <span class="intent-meta-value">${category}</span>
        </div>
        <div class="intent-meta-card">
          <span class="intent-meta-label">PRIORITAS</span>
          <span class="intent-meta-value">${priority}</span>
        </div>
      </div>
    </section>
  `;

  return { html, bindEvents() {} };
}
