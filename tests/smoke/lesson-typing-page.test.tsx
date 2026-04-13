import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import LessonTypingPage from '@/app/(typing)/world/[villageId]/type/[lessonId]/page'
import {
  resetNavigationMocks,
  routerSpies,
} from '@/tests/__mocks__/next-navigation'

vi.mock('@/lib/storage/use-resolved-progress', () => ({
  useResolvedProgress: vi.fn(),
}))

import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'

const mockedUseResolvedProgress = vi.mocked(useResolvedProgress)

describe('LessonTypingPage', () => {
  beforeEach(() => {
    resetNavigationMocks()
    mockedUseResolvedProgress.mockReset()
  })

  it('renders a dedicated lesson route with a back link to the gallery', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: {
        currentPhaseId: 'lantern',
        placement: {
          phaseId: 'lantern',
          phaseName: 'Lantern Line',
          summary: 'Build clean key recall with calm, repeatable rhythm.',
          recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
          reason: 'Seeded for the test.',
          selfRating: 'finding-keys',
          metrics: { wpm: 18, accuracy: 95, correctedErrors: 1 },
        },
        events: [],
        recentSessions: [],
        completedChapterIds: [],
        villageMastery: {
          'meadow-farm': 24,
          'fishing-docks': 0,
          'mountain-mine': 0,
          'forest-watch': 0,
          'desert-market': 0,
          'volcano-forge': 0,
        },
      },
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    await act(async () => {
      render(
        <LessonTypingPage
          params={
            Promise.resolve({
              villageId: 'meadow-farm',
              lessonId: 'meadow-farm-foundation-1-intro',
            })
          }
        />,
      )
    })

    expect(screen.getByRole('link', { name: /← back/i })).toHaveAttribute(
      'href',
      '/world/meadow-farm/type',
    )
    expect(
      screen.getByText((text) => /^1\/\d+$/.test(text)),
    ).toBeInTheDocument()
    expect(screen.getByLabelText(/typing input/i)).toBeInTheDocument()
    expect(screen.getByTestId('typing-line')).toBeInTheDocument()
    expect(routerSpies.replace).not.toHaveBeenCalledWith('/onboarding')
  })
})
