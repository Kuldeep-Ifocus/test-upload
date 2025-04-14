// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:41:10.013Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('gz-features div').filter({ hasText: 'PerformanceDistributed' }).nth(2).click();
  await page.getByRole('heading', { name: 'Realistic Simulation' }).click();
  await page.getByRole('heading', { name: 'Extensible' }).click();