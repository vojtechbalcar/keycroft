import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import VillageLandingPage from '@/app/(typing)/world/[villageId]/page'
import {
  resetNavigationMocks,
  routerSpies,
} from '@/tests/__mocks__/next-navigation'

vi.mock('@/lib/storage/use-resolved-progress', () => ({
  useResolvedProgress: vi.fn(),
}))

import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'

const mockedUseResolvedProgress = vi.mocked(useResolvedProgress)

function makeProgress(mastery: number) {
  return {
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
      'meadow-farm': mastery,
      'fishing-docks': 0,
      'mountain-mine': 0,
      'forest-watch': 0,
      'desert-market': 0,
      'volcano-forge': 0,
    },
  }
}

describe('VillageLandingPage', () => {
  beforeEach(() => {
    resetNavigationMocks()
    mockedUseResolvedProgress.mockReset()
  })

  it('shows the stage label for the starter village art based on mastery', async () => {
    mockedUseResolvedProgress.mockReturnValue({
      progress: makeProgress(86),
      setProgress: vi.fn(),
      signedIn: false,
      sessionUser: null,
    })

    await act(async () => {
      render(
        <VillageLandingPage
          params={Promise.resolve({ villageId: 'meadow-farm' })}
        />,
      )
    })

    expect(
      screen.getByRole('button', { name: 'Market Pavilion Lv. 6' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: /start typing/i }),
    ).toHaveAttribute('href', '/world/meadow-farm/type')
    expect(routerSpies.replace).not.toHaveBeenCalledWith('/onboarding')
  })
})
