import { describe, expect, it } from 'vitest'

import { recommendSideQuest } from '@/lib/progression/recommend-side-quest'

describe('recommendSideQuest', () => {
  it('recommends a recovery quest after repeated correction-heavy sessions', () => {
    const recommendation = recommendSideQuest({
      currentPhaseId: 'lantern',
      recentSessions: [
        {
          completedAt: '2026-04-01T10:00:00.000Z',
          wpm: 18,
          accuracy: 91,
          correctedErrors: 4,
        },
        {
          completedAt: '2026-04-02T10:00:00.000Z',
          wpm: 20,
          accuracy: 92.4,
          correctedErrors: 3,
        },
        {
          completedAt: '2026-04-03T10:00:00.000Z',
          wpm: 19,
          accuracy: 93,
          correctedErrors: 3,
        },
      ],
    })

    expect(recommendation).not.toBeNull()
    expect(recommendation?.chapterId).toBe('ch02-home-row')
    expect(recommendation?.skillFocus).toMatch(/accuracy|correction/i)
  })

  it('returns null when recent sessions are already clean and steady', () => {
    const recommendation = recommendSideQuest({
      currentPhaseId: 'workshop',
      recentSessions: [
        {
          completedAt: '2026-04-01T10:00:00.000Z',
          wpm: 31,
          accuracy: 97.2,
          correctedErrors: 0,
        },
        {
          completedAt: '2026-04-02T10:00:00.000Z',
          wpm: 33,
          accuracy: 96.5,
          correctedErrors: 1,
        },
      ],
    })

    expect(recommendation).toBeNull()
  })
})
