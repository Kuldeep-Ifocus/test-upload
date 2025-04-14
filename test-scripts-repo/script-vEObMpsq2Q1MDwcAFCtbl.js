// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:08:09.317Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.goto('https://gazebosim.org/features');
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.goto('https://gazebosim.org/docs/latest/');