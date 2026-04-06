import { expect, test } from 'playwright/test'

test('typing starts immediately on page load without a warm-up click', async ({
  page,
}) => {
  await page.goto('/play')

  await page.keyboard.type('c')

  await expect(page.locator('[data-status="correct"]').first()).toHaveText('c')
})

test('user can finish a short typing session', async ({ page }) => {
  await page.goto('/play')

  await page.getByTestId('typing-line').click()
  await page.keyboard.type('calm hands build quiet speed')

  await expect(
    page.getByRole('heading', { name: /session complete/i }),
  ).toBeVisible()
  await expect(page.getByText(/focus next/i)).toBeVisible()
  await expect(page.getByText(/wpm/i)).toBeVisible()
})
