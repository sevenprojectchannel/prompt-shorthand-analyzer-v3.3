/**
 * Prompt Formatter & Metrics Utility V2
 */

export function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  const words = text.trim().split(/\s+/).filter(Boolean);
  return words.length;
}

export function estimateTokens(text) {
  if (!text || typeof text !== 'string') return 0;
  // Approximation: ~4 chars per token for typical Indonesian/English mixed prompts
  const clean = text.trim();
  if (!clean) return 0;
  return Math.max(1, Math.ceil(clean.length / 3.8));
}

export function calculateShorthandDensity(prompt, shorthands = []) {
  if (!prompt || shorthands.length === 0) return 0;
  const totalWords = countWords(prompt);
  if (totalWords === 0) return 0;
  const shorthandCount = shorthands.length;
  return Math.min(100, Math.round((shorthandCount / totalWords) * 100));
}

export function calculateConcisenessScore(prompt, shorthands = []) {
  if (!prompt) return 0;
  const wordCount = countWords(prompt);
  if (wordCount === 0) return 0;

  // Good balance: around 5 to 20 words with 1 to 4 shorthands gives high score
  let score = 70;
  if (shorthands.length >= 1) score += 15;
  if (shorthands.length >= 2) score += 10;
  if (wordCount > 30) score -= 15;
  if (wordCount > 60) score -= 25;
  return Math.min(100, Math.max(20, score));
}

export function cleanPromptForCopy(optimalPrompt) {
  if (!optimalPrompt || typeof optimalPrompt !== 'string') return '';
  // Only the main prompt + shorthand tags, never any reasoning, metadata, or IP boilerplate
  return optimalPrompt.trim();
}
