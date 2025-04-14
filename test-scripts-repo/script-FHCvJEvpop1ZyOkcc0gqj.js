// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:38:15.068Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.getByRole('link', { name: 'Docs' }).click();
  await page.getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('button', { name: 'More' }).click();
  await page.getByRole('menuitem', { name: 'Media' }).click();
  await page.getByRole('link', { name: 'Showcase' }).click();
  await page.getByRole('link', { name: 'Features' }).click();