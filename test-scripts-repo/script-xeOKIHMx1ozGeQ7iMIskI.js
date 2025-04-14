// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T06:57:54.099Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'SDF worlds', exact: true }).click();
  await page.getByRole('link', { name: 'Sensors' }).click();