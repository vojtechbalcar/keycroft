import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import AppHomePage from '@/app/(hub)/home/page'
import { guestProfileStorageKey } from '@/lib/storage/guest-profile'
import { guestProgressStorageKey } from '@/lib/storage/guest-progress'
import {
  resetNavigationMocks,
  routerSpies,
} from '@/tests/__mocks__/next-navigation'

function seedGuestProfile() {
  window.localStorage.setItem(
    guestProfileStorageKey,
    JSON.stringify({
      id: 'guest-123',
      createdAt: '2026-04-01T08:00:00.000Z',
      updatedAt: '2026-04-01T08:00:00.000Z',
    }),
  )
}

describe('AppHomePage', () => {
  beforeEach(() => {
    window.localStorage.clear()
    resetNavigationMocks()
  })

  it('renders the loading state before progress is fetched', () => {
    render(<AppHomePage />)

    expect(
      screen.getByText(/loading your village/i),
    ).toBeInTheDocument()
  })

  it('redirects new guests into onboarding when placement is missing', async () => {
    render(<AppHomePage />)

    await waitFor(() => {
      expect(routerSpies.replace).toHaveBeenCalledWith('/onboarding')
    })
  })

  it('shows the chapter path and side quest recommendation for a returning guest', async () => {
    seedGuestProfile()
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
          metrics: { wpm: 18, accuracy: 92, correctedErrors: 3 },
        },
        events: [],
        recentSessions: [
          {
            completedAt: '2026-04-03T10:00:00.000Z',
            wpm: 18,
            accuracy: 91,
            correctedErrors: 4,
          },
          {
            completedAt: '2026-04-02T10:00:00.000Z',
            wpm: 19,
            accuracy: 92.4,
            correctedErrors: 3,
          },
          {
            completedAt: '2026-04-01T10:00:00.000Z',
            wpm: 20,
            accuracy: 93,
            correctedErrors: 3,
          },
        ],
        completedChapterIds: ['ch01-arrival'],
      }),
    )

    render(<AppHomePage />)

    await waitFor(() => {
      expect(screen.getByText(/guided chapters/i)).toBeInTheDocument()
    })

    expect(screen.getAllByText(/home row stability/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/recommended/i)).toBeInTheDocument()
    expect(screen.getAllByText(/adaptive side quest/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/home row reset/i)).toBeInTheDocument()
  })
})
