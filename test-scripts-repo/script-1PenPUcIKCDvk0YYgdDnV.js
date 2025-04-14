// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-11T13:04:00.703Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.getByRole('link', { name: 'Features', exact: true }).click();