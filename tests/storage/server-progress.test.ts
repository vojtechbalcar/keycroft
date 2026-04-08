import { describe, expect, test } from 'vitest'

import {
  mergeProgressSnapshots,
  type PersistedProgressSnapshot,
} from '@/lib/storage/server-progress'
import {
  createEmptyGuestProgress,
  recordCompletedChapter,
  recordPlacementResult,
  recordPracticeSession,
} from '@/lib/storage/guest-progress'

function createSeededProgress(): PersistedProgressSnapshot {
  let progress = createEmptyGuestProgress()

  progress = recordPlacementResult(
    progress,
    {
      phaseId: 'lantern',
      phaseName: 'Lantern Room',
      summary: 'Build clean key recall with calm, repeatable rhythm.',
      recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
      reason: 'Seed placement',
      selfRating: 'finding-keys',
      metrics: {
        wpm: 18,
        accuracy: 94,
        correctedErrors: 2,
      },
    },
    '2026-04-01T08:00:00.000Z',
  )

  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-02T08:00:00.000Z',
    wpm: 20,
    accuracy: 94,
    correctedErrors: 2,
  })

  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-03T08:00:00.000Z',
    wpm: 28,
    accuracy: 96,
    correctedErrors: 1,
  })

  progress = recordCompletedChapter(progress, 'ch01-arrival')

  return progress
}

describe('mergeProgressSnapshots', () => {
  test('deduplicates sessions, unions chapters, and recalculates current phase', () => {
    const existing = createSeededProgress()

    let incoming = createSeededProgress()
    incoming = recordPracticeSession(incoming, {
      completedAt: '2026-04-04T08:00:00.000Z',
      wpm: 30,
      accuracy: 96,
      correctedErrors: 1,
    })
    incoming = recordCompletedChapter(incoming, 'ch02-home-row')

    const merged = mergeProgressSnapshots(existing, incoming)

    expect(merged.completedChapterIds).toEqual([
      'ch01-arrival',
      'ch02-home-row',
    ])
    expect(merged.recentSessions).toEqual([
      {
        completedAt: '2026-04-04T08:00:00.000Z',
        wpm: 30,
        accuracy: 96,
        correctedErrors: 1,
      },
      {
        completedAt: '2026-04-03T08:00:00.000Z',
        wpm: 28,
        accuracy: 96,
        correctedErrors: 1,
      },
      {
        completedAt: '2026-04-02T08:00:00.000Z',
        wpm: 20,
        accuracy: 94,
        correctedErrors: 2,
      },
    ])
    expect(merged.events).toHaveLength(4)
    expect(merged.currentPhaseId).toBe('workshop')
  })

  test('preserves an existing placement when the incoming snapshot has none', () => {
    const existing = createSeededProgress()
    const incoming = {
      ...createEmptyGuestProgress(),
      recentSessions: [
        {
          completedAt: '2026-04-06T08:00:00.000Z',
          wpm: 31,
          accuracy: 97,
          correctedErrors: 0,
        },
      ],
    }

    const merged = mergeProgressSnapshots(existing, incoming)

    expect(merged.placement).toEqual(existing.placement)
    expect(merged.events[0]?.type).toBe('placement-completed')
  })
})
