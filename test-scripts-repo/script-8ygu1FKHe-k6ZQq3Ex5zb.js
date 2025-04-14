// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T06:22:04.517Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('link', { name: 'Features', exact: true }).click();
  await page.locator('body').click();
  await page.getByRole('button', { name: 'More' }).click();
  await page.locator('.cdk-overlay-backdrop').click();
  await page.getByText('FeaturesShowcaseDocsCommunityMoreAppmenu').click();