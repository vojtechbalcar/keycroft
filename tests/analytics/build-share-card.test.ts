import { describe, expect, test } from 'vitest'

import { buildShareCard } from '@/lib/analytics/build-share-card'
import {
  createEmptyGuestProgress,
  recordPlacementResult,
  recordPracticeSession,
} from '@/lib/storage/guest-progress'

function createShareProgress() {
  let progress = createEmptyGuestProgress()

  progress = recordPlacementResult(
    progress,
    {
      phaseId: 'workshop',
      phaseName: 'Workshop Lane',
      summary: 'Your hands already know the route. Now tighten consistency.',
      recommendedFocus: 'Hold accuracy while gradually stretching speed.',
      reason: 'Seeded share fixture.',
      selfRating: 'steady-practice',
      metrics: {
        wpm: 29,
        accuracy: 96,
        correctedErrors: 1,
      },
    },
    '2026-04-01T08:00:00.000Z',
  )

  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-02T08:00:00.000Z',
    wpm: 28,
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
    completedAt: '2026-04-04T08:00:00.000Z',
    wpm: 34,
    accuracy: 98,
    correctedErrors: 0,
  })
  progress = recordPracticeSession(progress, {
    completedAt: '2026-04-05T08:00:00.000Z',
    wpm: 35,
    accuracy: 98,
    correctedErrors: 0,
  })

  return progress
}

describe('buildShareCard', () => {
  test('builds a compact progress card model for active players', () => {
    const card = buildShareCard(createShareProgress())

    expect(card.headline).toMatch(/workshop lane/i)
    expect(card.subheadline).toContain('32 WPM average')
    expect(card.subheadline).toContain('97% accuracy')
    expect(card.highlights).toEqual([
      { label: 'Best speed', value: '35 WPM' },
      { label: 'Clean runs', value: '75%' },
      { label: 'Momentum', value: 'Rising' },
    ])
    expect(card.footer).toBe('Keycroft · Workshop Lane')
  })

  test('keeps the empty-state card calm when no sessions exist', () => {
    const card = buildShareCard(createEmptyGuestProgress())

    expect(card.headline).toMatch(/first real streak/i)
    expect(card.subheadline).toMatch(/start a short practice line/i)
    expect(card.highlights[0]).toEqual({ label: 'Best speed', value: '0 WPM' })
  })
})
