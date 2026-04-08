import { describe, expect, test } from 'vitest'

import {
  upgradeGuestToAccount,
  type GuestUpgradeStore,
} from '@/lib/auth/guest-upgrade'
import {
  createEmptyGuestProgress,
  recordCompletedChapter,
  recordPlacementResult,
  recordPracticeSession,
  type GuestProgress,
} from '@/lib/storage/guest-progress'

function createProgress(): GuestProgress {
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
        wpm: 19,
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
    correctedErrors: 1,
  })

  return recordCompletedChapter(progress, 'ch01-arrival')
}

function createStore(seed?: {
  links?: Record<string, string>
  progressByUserId?: Record<string, GuestProgress>
}) {
  const links = new Map(Object.entries(seed?.links ?? {}))
  const progressByUserId = new Map(Object.entries(seed?.progressByUserId ?? {}))
  const writes: Array<{
    userId: string
    guestProfileId: string
    progress: GuestProgress
  }> = []

  const store: GuestUpgradeStore = {
    async getLinkedUserId(guestProfileId) {
      return links.get(guestProfileId) ?? null
    },
    async readUserProgress(userId) {
      return progressByUserId.get(userId) ?? null
    },
    async writeUserProgress({ userId, guestProfileId, progress }) {
      writes.push({ userId, guestProfileId, progress })
      links.set(guestProfileId, userId)
      progressByUserId.set(userId, progress)
      return progress
    },
  }

  return { store, writes, progressByUserId }
}

describe('upgradeGuestToAccount', () => {
  test('merges guest progress into the signed-in account', async () => {
    const serverProgress = recordCompletedChapter(createProgress(), 'ch02-home-row')
    const guestProgress = recordPracticeSession(createProgress(), {
      completedAt: '2026-04-03T08:00:00.000Z',
      wpm: 30,
      accuracy: 97,
      correctedErrors: 0,
    })

    const { store, writes } = createStore({
      progressByUserId: {
        'user-1': serverProgress,
      },
    })

    const result = await upgradeGuestToAccount({
      store,
      userId: 'user-1',
      guestProfileId: 'guest-1',
      guestProgress,
    })

    if (result.status !== 'upgraded') {
      throw new Error(`Expected upgraded status, received ${result.status}.`)
    }

    expect(result.status).toBe('upgraded')
    expect(writes).toHaveLength(1)
    expect(result.progress.completedChapterIds).toEqual([
      'ch01-arrival',
      'ch02-home-row',
    ])
    expect(result.progress.recentSessions[0]?.completedAt).toBe(
      '2026-04-03T08:00:00.000Z',
    )
  })

  test('is idempotent when the guest profile is already linked', async () => {
    const existingProgress = createProgress()
    const { store, writes } = createStore({
      links: {
        'guest-1': 'user-1',
      },
      progressByUserId: {
        'user-1': existingProgress,
      },
    })

    const result = await upgradeGuestToAccount({
      store,
      userId: 'user-1',
      guestProfileId: 'guest-1',
      guestProgress: existingProgress,
    })

    if (result.status !== 'already-linked' || result.progress === null) {
      throw new Error('Expected an already-linked account with persisted progress.')
    }

    expect(result.status).toBe('already-linked')
    expect(result.progress).toEqual(existingProgress)
    expect(writes).toHaveLength(0)
  })
})
