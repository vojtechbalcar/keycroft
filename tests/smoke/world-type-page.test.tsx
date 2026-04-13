import React from 'react'
import { act, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import VillageTypePage from '@/app/(typing)/world/[villageId]/type/page'
import {
  resetNavigationMocks,
  routerSpies,
} from '@/tests/__mocks__/next-navigation'

vi.mock('@/lib/storage/use-resolved-progress', () => ({
  useResolvedProgress: vi.fn(),
}))

import { useResolvedProgress } from '@/lib/storage/use-resolved-progress'

const mockedUseResolvedProgress = vi.mocked(useResolvedProgress)

const readyProgress = {
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
}

describe('VillageTypePage', () => {
  beforeEach(() => {
    resetNavigationMocks()
    mockedUseResolvedProgress.mockReset()
  })

  it('can move from loading progress to the lesson atlas without crashing', async () => {
    mockedUseResolvedProgress
      .mockReturnValueOnce({
        progress: null,
        setProgress: vi.fn(),
        signedIn: false,
        sessionUser: null,
      })
      .mockReturnValue({
        progress: readyProgress,
        setProgress: vi.fn(),
        signedIn: false,
        sessionUser: null,
      })

    const params = Promise.resolve({ villageId: 'meadow-farm' })
    let rerender: ReturnType<typeof render>['rerender']

    await act(async () => {
      const rendered = render(<VillageTypePage params={params} />)
      rerender = rendered.rerender
    })

    await act(async () => {
      rerender(<VillageTypePage params={params} />)
    })

    expect(
      await screen.findByRole('link', { name: /meadow farm/i }),
    ).toBeInTheDocument()
    expect(screen.getByText(/foundation/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /keys f and j/i })).toHaveAttribute(
      'href',
      '/world/meadow-farm/type/meadow-farm-foundation-1-intro',
    )
    expect(routerSpies.replace).not.toHaveBeenCalledWith('/onboarding')
  })
})
