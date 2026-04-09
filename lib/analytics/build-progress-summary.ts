import { getPhaseDefinition } from '@/lib/placement/phase-definitions'
import type { StoredSessionSummary } from '@/lib/progression/progress-events'
import type { GuestProgress } from '@/lib/storage/guest-progress'

export type ProgressMomentum = 'rising' | 'steady' | 'resetting'
export type ConsistencyBand = 'forming' | 'steady' | 'locked-in'

export type ProgressSummary = {
  phaseId: GuestProgress['currentPhaseId']
  phaseName: string
  totalSessions: number
  totalPracticeDays: number
  completedChapters: number
  averageWpm: number
  averageAccuracy: number
  bestWpm: number
  bestAccuracy: number
  cleanRunRate: number
  totalCorrectedErrors: number
  momentum: ProgressMomentum
  consistencyBand: ConsistencyBand
}

function getSessionHistory(progress: GuestProgress): StoredSessionSummary[] {
  const sessionEvents = progress.events
    .filter(
      (
        event,
      ): event is Extract<
        typeof event,
        { type: 'practice-session-completed' }
      > => event.type === 'practice-session-completed',
    )
    .map((event) => event.session)

  const sessions = sessionEvents.length > 0 ? sessionEvents : progress.recentSessions

  return [...sessions].sort((a, b) => a.completedAt.localeCompare(b.completedAt))
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function getMomentum(sessions: StoredSessionSummary[]): ProgressMomentum {
  if (sessions.length < 4) {
    return 'steady'
  }

  const splitIndex = Math.ceil(sessions.length / 2)
  const early = sessions.slice(0, splitIndex)
  const recent = sessions.slice(-splitIndex)
  const wpmDelta = average(recent.map((session) => session.wpm)) - average(early.map((session) => session.wpm))
  const accuracyDelta =
    average(recent.map((session) => session.accuracy)) -
    average(early.map((session) => session.accuracy))

  if (accuracyDelta <= -2) {
    return 'resetting'
  }

  if (wpmDelta >= 3 && accuracyDelta >= 0) {
    return 'rising'
  }

  return 'steady'
}

function getConsistencyBand(sessions: StoredSessionSummary[]): ConsistencyBand {
  if (sessions.length < 3) {
    return 'forming'
  }

  const wpmValues = sessions.map((session) => session.wpm)
  const accuracyValues = sessions.map((session) => session.accuracy)
  const wpmSpread = Math.max(...wpmValues) - Math.min(...wpmValues)
  const accuracySpread = Math.max(...accuracyValues) - Math.min(...accuracyValues)

  if (accuracySpread <= 2 && wpmSpread <= 8) {
    return 'locked-in'
  }

  if (accuracySpread <= 4 && wpmSpread <= 14) {
    return 'steady'
  }

  return 'forming'
}

export function buildProgressSummary(progress: GuestProgress): ProgressSummary {
  const sessions = getSessionHistory(progress)
  const phaseId = progress.currentPhaseId
  const phaseName = phaseId ? getPhaseDefinition(phaseId).name : 'Unplaced'
  const totalSessions = sessions.length
  const totalPracticeDays = new Set(
    sessions.map((session) => session.completedAt.slice(0, 10)),
  ).size
  const averageWpm = average(sessions.map((session) => session.wpm))
  const averageAccuracy = average(sessions.map((session) => session.accuracy))
  const bestWpm = sessions.length === 0 ? 0 : Math.max(...sessions.map((session) => session.wpm))
  const bestAccuracy =
    sessions.length === 0 ? 0 : Math.max(...sessions.map((session) => session.accuracy))
  const cleanRunCount = sessions.filter((session) => session.correctedErrors === 0).length
  const totalCorrectedErrors = sessions.reduce(
    (sum, session) => sum + session.correctedErrors,
    0,
  )

  return {
    phaseId,
    phaseName,
    totalSessions,
    totalPracticeDays,
    completedChapters: progress.completedChapterIds.length,
    averageWpm,
    averageAccuracy,
    bestWpm,
    bestAccuracy,
    cleanRunRate:
      totalSessions === 0 ? 0 : Math.round((cleanRunCount / totalSessions) * 100),
    totalCorrectedErrors,
    momentum: getMomentum(sessions),
    consistencyBand: getConsistencyBand(sessions),
  }
}
