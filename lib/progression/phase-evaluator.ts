import { defaultPhaseId, type PhaseId } from '@/lib/placement/phase-definitions'
import type { ProgressEvent } from '@/lib/progression/progress-events'

function getRecentSessionAverages(events: ProgressEvent[]) {
  const sessions = events
    .filter((event) => event.type === 'practice-session-completed')
    .slice(-3)

  if (sessions.length < 3) {
    return null
  }

  const totalWpm = sessions.reduce((sum, event) => sum + event.session.wpm, 0)
  const totalAccuracy = sessions.reduce(
    (sum, event) => sum + event.session.accuracy,
    0,
  )

  return {
    averageWpm: totalWpm / sessions.length,
    averageAccuracy: totalAccuracy / sessions.length,
  }
}

export function evaluateCurrentPhase(events: ProgressEvent[]): PhaseId {
  const latestPlacement = [...events]
    .reverse()
    .find((event) => event.type === 'placement-completed')

  const basePhaseId = latestPlacement?.phaseId ?? defaultPhaseId
  const averages = getRecentSessionAverages(events)

  if (!averages) {
    return basePhaseId
  }

  if (
    basePhaseId === 'lantern' &&
    averages.averageWpm >= 26 &&
    averages.averageAccuracy >= 95
  ) {
    return 'workshop'
  }

  if (
    basePhaseId === 'workshop' &&
    averages.averageWpm >= 44 &&
    averages.averageAccuracy >= 96
  ) {
    return 'lookout'
  }

  return basePhaseId
}
