import { expect, test } from 'playwright/test'

test('app home loads with village hub', async ({ page }) => {
  await page.goto('/home')

  await expect(
    page.getByRole('heading', {
      name: /chapter 1/i,
    }),
  ).toBeVisible()
})
