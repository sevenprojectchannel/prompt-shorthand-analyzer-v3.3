/**
 * JsonTestPage Component V2
 * Tampilan pengujian format JSON terstruktur untuk verifikasi input, output,
 * hasil semantik, dan status validasi pipeline.
 */

export function renderJsonTestPage({
  analysisResult,
  onCopyJson,
  onRunCustomJson
}) {
  const inputJson = JSON.stringify({
    rawPrompt: analysisResult?.rawPrompt || '',
    cleanText: analysisResult?.cleanText || '',
    installedShorthands: analysisResult?.installedShorthands || []
  }, null, 2);

  const outputJson = JSON.stringify(analysisResult || {}, null, 2);

  const hasConflicts = analysisResult?.conflicts?.length > 0;
  const isSemanticValid = Boolean(analysisResult?.intent?.primaryAction && analysisResult.intent.primaryAction !== '-');
  const shorthandCount = analysisResult?.installedShorthands?.length || 0;
  const engineSource = analysisResult?.source || 'LOCAL_ENGINE';

  const html = `
    <section class="panel">
      <div class="card-header">
        <div>
          <h2 style="font-size: 1.25rem;">TEST (JSON) &mdash; PIPELINE DATA INSPECTOR</h2>
          <p style="font-size: 0.825rem; color: var(--text-muted); margin-top: 0.2rem;">
            Inspeksi representasi data JSON terstruktur untuk pengujian developer, integrasi API, dan validasi kepatuhan.
          </p>
        </div>
        <button type="button" class="btn btn-primary btn-sm" id="btn-copy-output-json">
          <svg class="icon-sm" viewBox="0 0 24 24"><path fill="currentColor" d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
          Salin Output JSON
        </button>
      </div>

      <!-- Validation Checklist Bar -->
      <div class="validation-row">
        <div class="val-item" style="border-left: 3px solid ${isSemanticValid ? 'var(--status-success)' : 'var(--text-muted)'};">
          <span>Semantik Valid:</span>
          <strong>${isSemanticValid ? '✅ Ya' : '⚪ Menunggu Input'}</strong>
        </div>
        <div class="val-item" style="border-left: 3px solid ${hasConflicts ? 'var(--status-danger)' : 'var(--status-success)'};">
          <span>Status Konflik:</span>
          <strong>${hasConflicts ? '⚠️ Terdeteksi' : '✅ Aman'}</strong>
        </div>
        <div class="val-item" style="border-left: 3px solid var(--accent-blue);">
          <span>Shorthand Aktif:</span>
          <strong>${shorthandCount} Item</strong>
        </div>
        <div class="val-item" style="border-left: 3px solid var(--accent-purple);">
          <span>Sumber Engine:</span>
          <strong>${engineSource}</strong>
        </div>
      </div>

      <!-- JSON Dual Viewer Grid -->
      <div class="json-viewer-container">
        <!-- Input JSON -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #93c5fd; text-transform: uppercase;">
              INPUT JSON
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Payload Masukan</span>
          </div>
          <pre class="json-box" id="json-input-view">${inputJson}</pre>
        </div>

        <!-- Output JSON -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: #6ee7b7; text-transform: uppercase;">
              OUTPUT JSON (PIPELINE RESULT)
            </span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">Hasil Analisis Lengkap</span>
          </div>
          <pre class="json-box" id="json-output-view">${outputJson}</pre>
        </div>
      </div>
    </section>
  `;

  return {
    html,
    bindEvents(container) {
      const copyBtn = container.querySelector('#btn-copy-output-json');
      if (copyBtn) {
        copyBtn.addEventListener('click', () => {
          if (onCopyJson) onCopyJson(outputJson);
        });
      }
    }
  };
}
