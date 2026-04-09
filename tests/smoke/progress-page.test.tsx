import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import ProgressPage from '@/app/(app)/progress/page'
import { createEmptyGuestProgress } from '@/lib/storage/guest-progress'
import {
  resetNavigationMocks,
  routerSpies,
} from '@/tests/__mocks__/next-navigation'

vi.mock('@/lib/storage/use-resolved-progress', () => ({
  useResolvedProgress: vi.fn(),
}))

import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'

const mockedUseResolvedProgress = vi.mocked(useResolvedProgress)

describe('ProgressPage', () => {
  beforeEach(() => {
    resetNavigationMocks()
    mockedUseResolvedProgress.mockReset()
  })

  it('renders the loading state before progress is resolved', () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: null,
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    render(<ProgressPage />)

    expect(screen.getByText(/loading your stockpile/i)).toBeInTheDocument()
  })

  it('redirects to onboarding when placement is missing', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: createEmptyGuestProgress(),
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    render(<ProgressPage />)

    await waitFor(() => {
      expect(routerSpies.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('renders the analytics view for a returning guest', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: {
        currentPhaseId: 'workshop',
        placement: {
          phaseId: 'workshop',
          phaseName: 'Workshop Lane',
          summary: 'Your hands already know the route. Now tighten consistency.',
          recommendedFocus: 'Hold accuracy while gradually stretching speed.',
          reason: 'Seeded for the test.',
          selfRating: 'steady-practice',
          metrics: { wpm: 29, accuracy: 96, correctedErrors: 1 },
        },
        events: [],
        recentSessions: [
          {
            completedAt: '2026-04-02T08:00:00.000Z',
            wpm: 28,
            accuracy: 96,
            correctedErrors: 1,
          },
          {
            completedAt: '2026-04-03T08:00:00.000Z',
            wpm: 31,
            accuracy: 97,
            correctedErrors: 0,
          },
          {
            completedAt: '2026-04-04T08:00:00.000Z',
            wpm: 34,
            accuracy: 98,
            correctedErrors: 0,
          },
          {
            completedAt: '2026-04-05T08:00:00.000Z',
            wpm: 35,
            accuracy: 98,
            correctedErrors: 0,
          },
        ],
        completedChapterIds: ['ch01-arrival', 'ch02-home-row'],
      },
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    render(<ProgressPage />)

    await waitFor(() => {
      expect(screen.getByText(/stockpile ledger/i)).toBeInTheDocument()
    })

    expect(screen.getAllByText(/workshop lane/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/4 sessions logged/i)).toBeInTheDocument()
    expect(screen.getByText(/recent run history/i)).toBeInTheDocument()
    expect(screen.getByText(/keyboard focus map/i)).toBeInTheDocument()
    expect(screen.getByText(/monthly reflection/i)).toBeInTheDocument()
    expect(screen.getByText(/shareable progress card/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /copy progress blurb/i }),
    ).toBeInTheDocument()
  }, 10000)
})
