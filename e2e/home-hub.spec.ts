import { expect, test } from '@playwright/test'

test.describe('Home Hub', () => {
  test('redirects to /onboarding when no placement exists', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({ id: 'guest-no-placement', createdAt: '2026-04-01T08:00:00.000Z', updatedAt: '2026-04-01T08:00:00.000Z' }),
      )
      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
          currentPhaseId: null,
          placement: null,
          events: [],
          recentSessions: [],
        }),
      )
    })

    await page.goto('/home')
    await expect(page).toHaveURL(/\/onboarding$/)
  })

  test('renders village hub for a lantern-phase user', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({ id: 'guest-lantern', createdAt: '2026-04-01T08:00:00.000Z', updatedAt: '2026-04-01T08:00:00.000Z' }),
      )
      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
          currentPhaseId: 'lantern',
          placement: {
            phaseId: 'lantern',
            phaseName: 'Lantern Quarter',
            summary: 'You have strong fundamentals.',
            recommendedFocus: 'Build speed while maintaining accuracy.',
            reason: 'Seeded for the test.',
            selfRating: 'just-starting',
            metrics: { wpm: 15, accuracy: 94, correctedErrors: 1 },
          },
          events: [],
          recentSessions: [
            {
              completedAt: '2026-04-01T10:00:00.000Z',
              wpm: 15,
              accuracy: 94,
              correctedErrors: 1,
            },
          ],
        }),
      )
    })

    await page.goto('/home')
    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText(/Lantern Quarter/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Construct/i })).toBeVisible()
  })

  test('shows different region state for workshop-phase user', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({ id: 'guest-workshop', createdAt: '2026-04-01T08:00:00.000Z', updatedAt: '2026-04-01T08:00:00.000Z' }),
      )
      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
          currentPhaseId: 'workshop',
          placement: {
            phaseId: 'workshop',
            phaseName: 'Workshop Lane',
            summary: 'You have a solid base.',
            recommendedFocus: 'Hold accuracy while gradually stretching speed.',
            reason: 'Seeded for the test.',
            selfRating: 'steady-practice',
            metrics: { wpm: 29, accuracy: 96, correctedErrors: 0 },
          },
          events: [],
          recentSessions: [
            {
              completedAt: '2026-04-01T10:30:00.000Z',
              wpm: 29,
              accuracy: 96,
              correctedErrors: 0,
            },
          ],
        }),
      )
    })

    await page.goto('/home')
    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText(/Market Row/i)).toBeVisible()
    await expect(page.getByText(/Tower District/i)).toBeVisible()
  })
})
