// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T06:36:03.130Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByLabel('Section Navigation').getByRole('link', { name: 'Actors' }).click();