// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:15:01.270Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.locator('html').click();
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('mat-toolbar').getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('link', { name: 'Docs' }).click();