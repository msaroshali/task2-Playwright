import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://app.maltego.com/');
  await page.getByRole('button', { name: 'Allow all cookies' }).click();
  await expect(page.locator('.MuiBox-root > div > .MuiBox-root').first()).toBeVisible();
  await expect(page.getByRole('heading').filter({ hasText: 'Sign In' }))
  .toContainText('Sign In to Maltego');
  
  await expect(page.locator('body')).toContainText('E-Mail *');
  await expect(page.locator('body')).toContainText('Password *');
  

  await expect(page.getByRole('button', { name: 'Sign in to Maltego' })).toBeVisible();
  await expect(page.getByRole('button')).toContainText('Sign in to Maltego');
  await expect(page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
  await expect(page.locator('body')).toContainText('Forgot Password?');
  await expect(page.getByText('© Maltego Technologies・ISO')).toBeVisible();
  await expect(page.locator('body')).toContainText('© Maltego Technologies・ISO 27001:2022 Certified');

  await expect(page.getByRole('textbox', { name: 'E-Mail' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'password' })).toBeEmpty();
  
  const email = "YOUR VALID EMAIL";
  const password = "YOUR VALID PASSWORD";
  
  await page.getByRole('textbox', { name: 'E-Mail' }).click();
  await page.getByRole('textbox', { name: 'E-Mail' }).fill(email);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await Promise.all([
    page.waitForURL('https://app.maltego.com/**', { timeout: 20000 }),
    page.getByRole('button', { name: 'Sign in to Maltego' }).click(),
  ]);
  await expect(page.getByLabel('Top Bar')).toBeVisible();
  await expect(page.getByTestId('user-avatar')).toBeVisible();
  await expect(page.getByText('AdminUsersProductsData')).toBeVisible();
  await expect(page.locator('#admin-widget')).toContainText('Admin');
  await expect(page.locator('#admin-widget')).toContainText('Users');
});