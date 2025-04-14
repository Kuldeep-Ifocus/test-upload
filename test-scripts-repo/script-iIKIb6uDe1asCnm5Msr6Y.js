// Test script for URL: https://gazebosim.org/docs/all/tutorials/
// Generated on: 2025-04-14T05:33:10.063Z

await page.goto('https://gazebosim.org/docs/all/tutorials/');
  await page.getByRole('listitem').filter({ hasText: /^Community$/ }).click();
  await page.locator('div').filter({ hasText: 'Sign Up Log In' }).nth(3).click();
  await page.getByRole('button', { name: 'Sign Up' }).click();