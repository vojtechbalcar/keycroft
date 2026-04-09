import type { GuestProgress } from '@/lib/storage/guest-progress'

import { buildProgressSummary } from '@/lib/analytics/build-progress-summary'

export type ShareCardModel = {
  headline: string
  subheadline: string
  highlights: Array<{
    label: string
    value: string
  }>
  footer: string
}

function getMomentumLabel(momentum: ReturnType<typeof buildProgressSummary>['momentum']) {
  if (momentum === 'rising') return 'Rising'
  if (momentum === 'resetting') return 'Resetting'
  return 'Steady'
}

export function buildShareCard(progress: GuestProgress): ShareCardModel {
  const summary = buildProgressSummary(progress)

  return {
    headline:
      summary.totalSessions === 0
        ? 'The village is ready for its first real streak.'
        : `${summary.phaseName} is settling into a stronger rhythm.`,
    subheadline:
      summary.totalSessions === 0
        ? 'Start a short practice line to give the first progress card something to remember.'
        : `${summary.averageWpm} WPM average with ${summary.averageAccuracy}% accuracy across ${summary.totalSessions} sessions.`,
    highlights: [
      { label: 'Best speed', value: `${summary.bestWpm} WPM` },
      { label: 'Clean runs', value: `${summary.cleanRunRate}%` },
      { label: 'Momentum', value: getMomentumLabel(summary.momentum) },
    ],
    footer: `Keycroft · ${summary.phaseName}`,
  }
}
