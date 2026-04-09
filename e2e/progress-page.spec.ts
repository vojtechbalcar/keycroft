import { expect, test } from 'playwright/test'

test.describe('Progress Page', () => {
  test('redirects guests without placement back to onboarding', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({
          id: 'guest-no-progress-placement',
          createdAt: '2026-04-01T08:00:00.000Z',
          updatedAt: '2026-04-01T08:00:00.000Z',
        }),
      )
      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
          currentPhaseId: null,
          placement: null,
          events: [],
          recentSessions: [],
          completedChapterIds: [],
        }),
      )
    })

    await page.goto('/progress')
    await expect(page).toHaveURL(/\/onboarding$/)
  })

  test('shows analytics, reflection, and share card for a returning guest', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({
          id: 'guest-progress',
          createdAt: '2026-04-01T08:00:00.000Z',
          updatedAt: '2026-04-01T08:00:00.000Z',
        }),
      )
      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
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
        }),
      )
    })

    await page.goto('/progress')

    await expect(page.getByText(/stockpile ledger/i)).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Workshop Lane', exact: true }),
    ).toBeVisible()
    await expect(page.getByText(/recent run history/i)).toBeVisible()
    await expect(page.getByText(/keyboard focus map/i)).toBeVisible()
    await expect(page.getByText(/monthly reflection/i)).toBeVisible()
    await expect(page.getByText(/shareable progress card/i)).toBeVisible()
    await expect(
      page.getByRole('button', { name: /copy progress blurb/i }),
    ).toBeVisible()
  })
})
