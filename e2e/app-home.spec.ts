import { expect, test } from 'playwright/test'

test('app home loads', async ({ page }) => {
  await page.goto('/home')

  await expect(
    page.getByRole('heading', {
      name: /keycroft home/i,
    }),
  ).toBeVisible()
})
