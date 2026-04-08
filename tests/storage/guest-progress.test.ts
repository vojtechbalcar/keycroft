import { describe, expect, it } from 'vitest'

import { assessPlacement } from '@/lib/placement/assess'
import {
  createEmptyGuestProgress,
  readGuestProgress,
  recordPlacementResult,
  recordPracticeSession,
  saveGuestProgress,
} from '@/lib/storage/guest-progress'
import {
  ensureGuestProfile,
  type StorageLike,
} from '@/lib/storage/guest-profile'

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>()
  return {
    getItem(key) { return values.get(key) ?? null },
    setItem(key, value) { values.set(key, value) },
    removeItem(key) { values.delete(key) },
  }
}

describe('guest storage', () => {
  it('creates a stable guest profile id once and reuses it later', () => {
    const storage = createMemoryStorage()
    const firstProfile = ensureGuestProfile(storage, {
      now: () => '2026-04-01T08:00:00.000Z',
      createId: () => 'guest-123',
    })
    const secondProfile = ensureGuestProfile(storage, {
      now: () => '2026-04-01T08:10:00.000Z',
      createId: () => 'guest-999',
    })
    expect(firstProfile.id).toBe('guest-123')
    expect(secondProfile.id).toBe('guest-123')
  })

  it('persists a placement result and current phase', () => {
    const storage = createMemoryStorage()
    const placement = assessPlacement({
      metrics: {
        elapsedMs: 24000,
        correctCharacters: 32,
        characterInputCount: 33,
        correctedErrors: 1,
        accuracy: 97,
        wpm: 18,
        cleanRun: false,
      },
      selfRating: 'finding-keys',
    })
    const nextProgress = recordPlacementResult(
      createEmptyGuestProgress(),
      placement,
      '2026-04-01T08:00:00.000Z',
    )
    saveGuestProgress(storage, nextProgress)
    expect(readGuestProgress(storage)).toEqual(
      expect.objectContaining({ currentPhaseId: 'lantern', placement }),
    )
  })

  it('keeps the five most recent practice sessions in newest-first order', () => {
    const storage = createMemoryStorage()
    let progress = createEmptyGuestProgress()

    progress = recordPlacementResult(
      progress,
      assessPlacement({
        metrics: {
          elapsedMs: 18000,
          correctCharacters: 32,
          characterInputCount: 32,
          correctedErrors: 0,
          accuracy: 100,
          wpm: 28,
          cleanRun: true,
        },
        selfRating: 'steady-practice',
      }),
      '2026-04-01T08:00:00.000Z',
    )

    for (let index = 0; index < 6; index += 1) {
      progress = recordPracticeSession(progress, {
        completedAt: `2026-04-0${index + 1}T09:00:00.000Z`,
        wpm: 26 + index,
        accuracy: 95 + index * 0.1,
        correctedErrors: index % 2,
      })
    }

    saveGuestProgress(storage, progress)
    const stored = readGuestProgress(storage)
    expect(stored.recentSessions).toHaveLength(5)
    expect(stored.recentSessions[0]?.completedAt).toBe('2026-04-06T09:00:00.000Z')
    expect(stored.recentSessions.at(-1)?.completedAt).toBe('2026-04-02T09:00:00.000Z')
  })
})
