// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:12:29.233Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('link', { name: 'Features' }).click();
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.goto('https://gazebosim.org/docs/latest/getstarted/');