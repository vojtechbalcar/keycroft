import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ChapterPage from '@/app/(app)/chapters/[chapterId]/page'
import { createEmptyGuestProgress } from '@/lib/storage/guest-progress'
import {
  resetNavigationMocks,
  routerSpies,
  setMockParams,
} from '@/tests/__mocks__/next-navigation'

vi.mock('@/lib/storage/use-resolved-progress', () => ({
  useResolvedProgress: vi.fn(),
}))

import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'

const mockedUseResolvedProgress = vi.mocked(useResolvedProgress)

describe('ChapterPage', () => {
  beforeEach(() => {
    resetNavigationMocks()
    setMockParams({ chapterId: 'ch01-arrival' })
    mockedUseResolvedProgress.mockReset()
  })

  it('redirects to onboarding when placement is missing', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: createEmptyGuestProgress(),
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    render(<ChapterPage />)

    await waitFor(() => {
      expect(routerSpies.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('renders the requested chapter for a placed guest', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: {
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
      },
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    render(<ChapterPage />)

    await waitFor(() => {
      expect(screen.getByText('Arrival')).toBeInTheDocument()
    })

    expect(screen.getAllByText(/lantern line/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/lesson 1 of 4/i)).toBeInTheDocument()
  })
})
