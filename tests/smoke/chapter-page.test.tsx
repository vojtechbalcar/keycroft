import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import ChapterPage from '@/app/(app)/chapters/[chapterId]/page'
import { guestProfileStorageKey } from '@/lib/storage/guest-profile'
import { guestProgressStorageKey } from '@/lib/storage/guest-progress'
import {
  resetNavigationMocks,
  routerSpies,
  setMockParams,
} from '@/tests/__mocks__/next-navigation'

describe('ChapterPage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetNavigationMocks()
    setMockParams({ chapterId: 'ch01-arrival' })
  })

  it('redirects to onboarding when placement is missing', async () => {
    render(<ChapterPage />)

    await waitFor(() => {
      expect(routerSpies.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('renders the requested chapter for a placed guest', async () => {
    window.localStorage.setItem(
      guestProfileStorageKey,
      JSON.stringify({
        id: 'guest-123',
        createdAt: '2026-04-01T08:00:00.000Z',
        updatedAt: '2026-04-01T08:00:00.000Z',
      }),
    )
    window.localStorage.setItem(
      guestProgressStorageKey,
      JSON.stringify({
        currentPhaseId: 'lantern',
        placement: {
          phaseId: 'lantern',
          phaseName: 'Lantern Room',
          summary: 'Build clean key recall with calm, repeatable rhythm.',
          recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
          reason: 'Seeded for the test.',
          selfRating: 'finding-keys',
          metrics: { wpm: 18, accuracy: 95, correctedErrors: 1 },
        },
        events: [],
        recentSessions: [],
        completedChapterIds: [],
      }),
    )

    render(<ChapterPage />)

    await waitFor(() => {
      expect(screen.getByText('Arrival')).toBeInTheDocument()
    })

    expect(screen.getAllByText(/lantern line/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/lesson 1 of 4/i)).toBeInTheDocument()
  })
})
