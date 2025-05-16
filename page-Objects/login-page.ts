import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;

  }

  async goto() {
    await this.page.goto('https://app.maltego.com/');
  }

  async acceptCookies() {
    await this.page.getByRole('button', { name: 'Allow all cookies' }).click();
  }

  async verifyLoginPageVisible() {
    await expect(this.page.locator('.MuiBox-root > div > .MuiBox-root').first()).toBeVisible();
    await expect(this.page.getByRole('heading').filter({ hasText: 'Sign In' })).toContainText('Sign In to Maltego');
    await expect(this.page.locator('body')).toContainText('E-Mail *');
    await expect(this.page.locator('body')).toContainText('Password *');
    await expect(this.page.getByRole('button', { name: 'Sign in to Maltego' })).toBeVisible();
    await expect(this.page.getByRole('button')).toContainText('Sign in to Maltego');
    await expect(this.page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
    await expect(this.page.locator('body')).toContainText('Forgot Password?');
    await expect(this.page.getByText('© Maltego Technologies・ISO')).toBeVisible();
    await expect(this.page.locator('body')).toContainText('© Maltego Technologies・ISO 27001:2022 Certified');
  }

  async login(email: string, password: string) {
    await expect(this.page.getByRole('textbox', { name: 'E-Mail' })).toBeEmpty();
    await expect(this.page.getByRole('textbox', { name: 'password' })).toBeEmpty();

    await this.page.getByRole('textbox', { name: 'E-Mail' }).click();
    await this.page.getByRole('textbox', { name: 'E-Mail' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);

    await Promise.all([
      this.page.waitForURL('https://app.maltego.com/**', { timeout: 20000 }),
      this.page.getByRole('button', { name: 'Sign in to Maltego' }).click(),
    ]);
  }


}