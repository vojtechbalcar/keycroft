import { describe, expect, test } from 'vitest'

import { buildHistorySeries } from '@/lib/analytics/build-history-series'
import {
  createEmptyGuestProgress,
  recordPlacementResult,
  recordPracticeSession,
} from '@/lib/storage/guest-progress'

function createHistoryProgress() {
  let progress = createEmptyGuestProgress()

  progress = recordPlacementResult(
    progress,
    {
      phaseId: 'lantern',
      phaseName: 'Lantern Room',
      summary: 'Build clean key recall with calm, repeatable rhythm.',
      recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
      reason: 'Seeded history fixture.',
      selfRating: 'finding-keys',
      metrics: {
        wpm: 20,
        accuracy: 94,
        correctedErrors: 2,
      },
    },
    '2026-04-01T08:00:00.000Z',
  )

  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-02T08:00:00.000Z',
    wpm: 24,
    accuracy: 95,
    correctedErrors: 2,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-02T19:00:00.000Z',
    wpm: 28,
    accuracy: 97,
    correctedErrors: 0,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-03T08:00:00.000Z',
    wpm: 31,
    accuracy: 96,
    correctedErrors: 1,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-05T08:00:00.000Z',
    wpm: 35,
    accuracy: 98,
    correctedErrors: 0,
  })

  return progress
}

describe('buildHistorySeries', () => {
  test('groups sessions by day and sorts the series chronologically', () => {
    const series = buildHistorySeries(createHistoryProgress())

    expect(series).toEqual([
      {
        date: '2026-04-02',
        label: 'Apr 2',
        sessionCount: 2,
        averageWpm: 26,
        averageAccuracy: 96,
        cleanRunCount: 1,
      },
      {
        date: '2026-04-03',
        label: 'Apr 3',
        sessionCount: 1,
        averageWpm: 31,
        averageAccuracy: 96,
        cleanRunCount: 0,
      },
      {
        date: '2026-04-05',
        label: 'Apr 5',
        sessionCount: 1,
        averageWpm: 35,
        averageAccuracy: 98,
        cleanRunCount: 1,
      },
    ])
  })

  test('can limit the returned series to the most recent days', () => {
    const series = buildHistorySeries(createHistoryProgress(), { days: 2 })

    expect(series.map((entry) => entry.date)).toEqual([
      '2026-04-03',
      '2026-04-05',
    ])
  })
})
