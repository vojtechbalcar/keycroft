import { expect, test } from 'playwright/test'

test.describe('Chapter Progress', () => {
  test('completes the arrival chapter and unlocks the next recommendation', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'keycroft.guest.profile',
        JSON.stringify({
          id: 'guest-chapter',
          createdAt: '2026-04-01T08:00:00.000Z',
          updatedAt: '2026-04-01T08:00:00.000Z',
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
            reason: 'Seeded for the test.',
            selfRating: 'finding-keys',
            metrics: { wpm: 18, accuracy: 95, correctedErrors: 1 },
          },
          events: [],
          recentSessions: [],
          completedChapterIds: [],
        }),
      )
    })

    await page.goto('/chapters/ch01-arrival')

    for (const prompt of [
      'calm hands build quiet speed',
      'soft steps keep the lanterns bright',
      'clear words, steady hands, open doors.',
      'quiet rhythm wakes the village one clean line at a time',
    ]) {
      await page.getByLabel('Typing input').focus()
      await page.keyboard.type(prompt)

      const continueButton = page.getByRole('button', { name: /continue chapter|replay capstone/i })
      await expect(continueButton).toBeVisible()

      if (await continueButton.getByText(/continue chapter/i).count()) {
        await continueButton.click()
      }
    }

    await expect(page.getByText(/chapter complete/i)).toBeVisible()

    await page.getByRole('link', { name: /return to your village/i }).click()
    await expect(page).toHaveURL(/\/home$/)
    await expect(page.getByText(/home row stability/i).first()).toBeVisible()
  })
})
