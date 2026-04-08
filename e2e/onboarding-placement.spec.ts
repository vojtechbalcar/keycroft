import { expect, test, type Page } from 'playwright/test'

const placementLine = 'steady hands shape patient rhythm'
const practiceLine = 'calm hands build quiet speed'

async function typeLine(page: Page, text: string) {
  const input = page.getByLabel(/typing input/i)
  await input.click()
  for (const character of text) {
    await input.press(character === ' ' ? 'Space' : character)
  }
}

test('a first-time guest completes onboarding and lands on home', async ({ page }) => {
  await page.addInitScript(() => { window.localStorage.clear() })
  await page.goto('/home')
  await expect(page).toHaveURL(/\/onboarding$/)

  await page.getByRole('button', { name: /begin placement/i }).click()
  await typeLine(page, placementLine)

  await page.getByLabel(/I already have some steady practice but want structure./i).check()
  await page.getByRole('button', { name: /see my starting phase/i }).click()

  await expect(page.getByText(/starting phase/i)).toBeVisible()
  await page.getByRole('link', { name: /go to home/i }).click()

  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByText(/current path/i)).toBeVisible()
})

test('completed play sessions show up in home history', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      'keycroft.guest.profile',
      JSON.stringify({ id: 'guest-123', createdAt: '2026-04-01T08:00:00.000Z', updatedAt: '2026-04-01T08:00:00.000Z' }),
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
        recentSessions: [],
      }),
    )
  })

  await page.goto('/play')
  await typeLine(page, practiceLine)
  await expect(page.getByRole('heading', { name: /session complete/i })).toBeVisible()

  await page.goto('/home')
  await expect(page.getByText(/recent history/i)).toBeVisible()
  await expect(page.getByText(/WPM/i)).toBeVisible()
})
