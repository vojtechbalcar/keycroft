import { describe, expect, test } from 'vitest'

import { buildProgressSummary } from '@/lib/analytics/build-progress-summary'
import {
  createEmptyGuestProgress,
  recordCompletedChapter,
  recordPlacementResult,
  recordPracticeSession,
} from '@/lib/storage/guest-progress'

function createFixtureProgress() {
  let progress = createEmptyGuestProgress()

  progress = recordPlacementResult(
    progress,
    {
      phaseId: 'lantern',
      phaseName: 'Lantern Room',
      summary: 'Build clean key recall with calm, repeatable rhythm.',
      recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
      reason: 'Seeded analytics fixture.',
      selfRating: 'steady-practice',
      metrics: {
        wpm: 22,
        accuracy: 95,
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
    wpm: 27,
    accuracy: 96,
    correctedErrors: 1,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-03T08:00:00.000Z',
    wpm: 31,
    accuracy: 97,
    correctedErrors: 0,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-05T08:00:00.000Z',
    wpm: 34,
    accuracy: 98,
    correctedErrors: 0,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-06T08:00:00.000Z',
    wpm: 36,
    accuracy: 98,
    correctedErrors: 0,
  })

  progress = recordCompletedChapter(progress, 'ch01-arrival')
  progress = recordCompletedChapter(progress, 'ch02-home-row')

  return progress
}

describe('buildProgressSummary', () => {
  test('summarizes pace, accuracy, consistency, and chapter completion', () => {
    const summary = buildProgressSummary(createFixtureProgress())

    expect(summary.phaseId).toBe('workshop')
    expect(summary.phaseName).toBe('Workshop Lane')
    expect(summary.totalSessions).toBe(5)
    expect(summary.totalPracticeDays).toBe(4)
    expect(summary.completedChapters).toBe(2)
    expect(summary.averageWpm).toBe(30)
    expect(summary.averageAccuracy).toBe(97)
    expect(summary.bestWpm).toBe(36)
    expect(summary.bestAccuracy).toBe(98)
    expect(summary.cleanRunRate).toBe(60)
    expect(summary.totalCorrectedErrors).toBe(3)
    expect(summary.momentum).toBe('rising')
    expect(summary.consistencyBand).toBe('steady')
  })

  test('returns a calm empty summary when no practice sessions exist', () => {
    const progress = createEmptyGuestProgress()
    const summary = buildProgressSummary(progress)

    expect(summary.totalSessions).toBe(0)
    expect(summary.averageWpm).toBe(0)
    expect(summary.averageAccuracy).toBe(0)
    expect(summary.bestWpm).toBe(0)
    expect(summary.cleanRunRate).toBe(0)
    expect(summary.momentum).toBe('steady')
    expect(summary.consistencyBand).toBe('forming')
  })
})
