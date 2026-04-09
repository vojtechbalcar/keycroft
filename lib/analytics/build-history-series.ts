import type { StoredSessionSummary } from '@/lib/progression/progress-events'
import type { GuestProgress } from '@/lib/storage/guest-progress'

export type HistoryPoint = {
  date: string
  label: string
  sessionCount: number
  averageWpm: number
  averageAccuracy: number
  cleanRunCount: number
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

function formatLabel(date: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00.000Z`))
}

export function buildHistorySeries(
  progress: GuestProgress,
  options: {
    days?: number
  } = {},
): HistoryPoint[] {
  const sessions = getSessionHistory(progress)
  const buckets = new Map<string, StoredSessionSummary[]>()

  for (const session of sessions) {
    const date = session.completedAt.slice(0, 10)
    const existing = buckets.get(date) ?? []
    existing.push(session)
    buckets.set(date, existing)
  }

  const series = [...buckets.entries()].map(([date, daySessions]) => ({
    date,
    label: formatLabel(date),
    sessionCount: daySessions.length,
    averageWpm: average(daySessions.map((session) => session.wpm)),
    averageAccuracy: average(daySessions.map((session) => session.accuracy)),
    cleanRunCount: daySessions.filter((session) => session.correctedErrors === 0).length,
  }))

  const ordered = series.sort((a, b) => a.date.localeCompare(b.date))

  if (options.days && options.days > 0) {
    return ordered.slice(-options.days)
  }

  return ordered
}
