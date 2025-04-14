import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('heading', { name: 'Projects' }).click();
});