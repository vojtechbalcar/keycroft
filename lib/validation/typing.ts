export function ensurePlayableText(targetText: string): string {
  if (targetText.length === 0) {
    throw new Error('Practice text must not be empty.')
  }

  if (targetText.includes('\n') || targetText.includes('\r')) {
    throw new Error('Stage 2 practice text must stay on one line.')
  }

  return targetText
}
