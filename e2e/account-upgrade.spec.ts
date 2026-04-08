import { expect, test } from 'playwright/test'

test.describe('Account Upgrade', () => {
  test('upgrades local guest progress into an account and restores it after local reset', async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({
          id: 'guest-upgrade-e2e',
          createdAt: '2026-04-08T08:00:00.000Z',
          updatedAt: '2026-04-08T08:00:00.000Z',
        }),
      )

      window.localStorage.setItem(
        'keycroft.guest.progress',
        JSON.stringify({
          currentPhaseId: 'lantern',
          placement: {
            phaseId: 'lantern',
            phaseName: 'Lantern Room',
            summary: 'Build clean key recall with calm, repeatable rhythm.',
            recommendedFocus: 'Slow enough to stay accurate, then add pace later.',
            reason: 'Seeded for the account upgrade flow.',
            selfRating: 'finding-keys',
            metrics: { wpm: 19, accuracy: 95, correctedErrors: 1 },
          },
          events: [],
          recentSessions: [
            {
              completedAt: '2026-04-08T08:30:00.000Z',
              wpm: 24,
              accuracy: 97,
              correctedErrors: 1,
            },
          ],
          completedChapterIds: ['ch01-arrival'],
        }),
      )
    })

    await page.goto('/settings')

    await page.getByLabel('Local test account').fill('upgrade-e2e@keycroft.local')
    await page.getByRole('button', { name: /sign in with test account/i }).click()

    await expect(page.getByText(/account connected/i)).toBeVisible()
    await expect(
      page.getByText(/upgrade-e2e@keycroft\.local/i).first(),
    ).toBeVisible()

    await page.goto('/home')
    await expect(page.getByText(/home row stability/i).first()).toBeVisible()

    await page.evaluate(() => {
      window.localStorage.clear()
    })

    await page.reload()
    await expect(page.getByText(/home row stability/i).first()).toBeVisible()
  })
})
