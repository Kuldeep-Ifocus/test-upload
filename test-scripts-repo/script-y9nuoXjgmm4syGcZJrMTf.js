// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T06:27:29.484Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('mat-toolbar').getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('mat-toolbar').getByRole('link', { name: 'Showcase' }).click();