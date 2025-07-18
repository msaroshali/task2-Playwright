import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  //Locators
  readonly logo: Locator;
  readonly emailLabel: Locator;
  readonly passwordLabel: Locator;
  readonly forgotPasswordLink: Locator;
  readonly licenseText: Locator;
  readonly loginError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.locator('.MuiBox-root > div > .MuiBox-root').first();
    this.emailLabel = page.locator('body');
    this.passwordLabel = page.locator('body');
    this.forgotPasswordLink = page.locator('body');
    this.licenseText = page.locator('body');
    this.loginError = page.locator('body');
  }

  async goto() {
    await this.page.goto('https://app.maltego.com/');
  }

  async acceptCookies() {
    await this.page.getByRole('button', { name: 'Allow all cookies' }).click();
  }

  async verifyLoginPageVisible() {
    await expect(this.logo).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Login to Maltego' })).toBeVisible();
    await expect(this.emailLabel).toContainText('E-Mail *');
    await expect(this.passwordLabel).toContainText('Password *');
    await expect(this.page.getByRole('button', { name: 'Login to Maltego' })).toBeVisible();
    await expect(this.page.getByRole('button')).toContainText('Login to Maltego');
    await expect(this.page.getByRole('link', { name: 'Forgot Password?' })).toBeVisible();
    await expect(this.forgotPasswordLink).toContainText('Forgot Password?');;
    await expect(this.page.getByText('© Maltego Technologies・ISO')).toBeVisible();
    await expect(this.licenseText).toContainText('© Maltego Technologies・ISO 27001:2022 Certified');
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
      this.page.getByRole('button', { name: 'Login to Maltego' }).click(),
    ]);
  }

  async loginDuringSignUp(password: string) {
    await this.page.getByRole('textbox', { name: 'Password' }).click({ timeout: 20000 });
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await Promise.all([
      this.page.waitForURL('https://app.maltego.com/**', { timeout: 20000 }),
      this.page.getByRole('button', { name: 'Sign in' }).click(),
    ]);
  }
  

  async loginInvalid(email: string, password: string) {
    await expect(this.page.getByRole('textbox', { name: 'E-Mail' })).toBeEmpty();
    await expect(this.page.getByRole('textbox', { name: 'password' })).toBeEmpty();
    await this.page.getByRole('textbox', { name: 'E-Mail' }).click();
    await this.page.getByRole('textbox', { name: 'E-Mail' }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    this.page.getByRole('button', { name: 'Login to Maltego' }).click();

  }
  
  async verifyLoginErrorMessage() {
    await expect(this.page.getByText('Incorrect credentials. Please')).toBeVisible({timeout: 60000});
    await expect(this.loginError).toContainText('Incorrect credentials. Please double check your email and password. Alternatively, you can reset your password.');
  }

  async loginWithPasswordOnly( password: string) {
    await expect(this.page.getByRole('textbox', { name: 'password' })).toBeEmpty();
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await Promise.all([
      this.page.waitForURL('https://app.maltego.com/**', { timeout: 20000 }),
      this.page.getByRole('button', { name: 'Sign in' }).click(),
    ]);
  }
}