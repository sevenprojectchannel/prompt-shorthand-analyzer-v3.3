/**
 * PresetTests Component V2
 */

import { PRESET_TEST_CASES } from '../data/presetsData.js';

export function renderPresetTests(onSelectPreset) {
  const chipsHtml = PRESET_TEST_CASES.map(p => `
    <button type="button" class="btn-preset-chip" data-preset-id="${p.id}" title="${p.description}">
      <span style="font-weight: 700; color: #93c5fd;">${p.label}</span>
    </button>
  `).join('');

  const html = `
    <div class="presets-group">
      <span class="presets-label">Preset Test Case Cepat:</span>
      <div class="presets-cloud">
        ${chipsHtml}
      </div>
    </div>
  `;

  return {
    html,
    bindEvents(container) {
      container.querySelectorAll('.btn-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-preset-id');
          const preset = PRESET_TEST_CASES.find(p => p.id === id);
          if (preset && onSelectPreset) {
            onSelectPreset(preset.prompt);
          }
        });
      });
    }
  };
}
