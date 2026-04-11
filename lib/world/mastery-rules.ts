export const MASTERY_UNLOCK_THRESHOLD = 80
export const MASTERY_MAX = 100

export function computeMasteryGain(metrics: { accuracy: number }): number {
  if (metrics.accuracy >= 95) return 8
  if (metrics.accuracy >= 85) return 5
  return 2
}

export function applyMasteryGain(current: number, gain: number): number {
  return Math.min(MASTERY_MAX, current + gain)
}
