import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('mat-toolbar').getByRole('link', { name: 'Showcase' }).click();
});