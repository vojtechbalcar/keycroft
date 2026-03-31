import { expect, test } from 'playwright/test'

test('marketing home loads', async ({ page }) => {
  await page.goto('/')

  await expect(
    page.getByRole('heading', {
      name: /build a village while you build real typing skill/i,
    }),
  ).toBeVisible()
})
