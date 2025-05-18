import { expect, type Locator, type Page } from '@playwright/test';
export class SignUpPage {
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

  async verifySignUpPageVisible() {
    await expect(this.page.getByRole('img', { name: 'maltego-logo' })).toBeVisible();
    await expect(this.page.getByRole('heading')).toContainText('Create Maltego ID');
    await expect(this.page.getByRole('textbox', { name: 'E-Mail' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'First name' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await expect(this.page.locator('form')).toContainText('E-Mail *');
    await expect(this.page.locator('form')).toContainText('First name *');
    await expect(this.page.locator('form')).toContainText('Last name *');
    await expect(this.page.getByRole('textbox', { name: 'E-Mail' })).toBeEmpty();
    await expect(this.page.getByRole('textbox', { name: 'First name' })).toBeEmpty();
    await expect(this.page.getByRole('textbox', { name: 'Last name' })).toBeEmpty();
  }

  async fillSignUpDetails(emailAddress: string, firstName: string, lastName: string, password: string) {
    // Fill in the form
    await this.page.getByRole('textbox', { name: 'E-Mail' }).click();
    await this.page.getByRole('textbox', { name: 'E-Mail' }).fill(emailAddress); 
    await this.page.getByRole('textbox', { name: 'E-Mail' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'First name' }).fill(firstName);
    await this.page.getByRole('textbox', { name: 'First name' }).press('Tab');
    await this.page.getByRole('textbox', { name: 'Last name' }).fill(lastName);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  
    // Set a password
    await expect(this.page.getByRole('heading')).toContainText('Create Maltego ID');
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await expect(this.page.locator('button[name="method"]')).toContainText('Continue');
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await expect(this.page.locator('body')).toContainText('Use 8–64 letters, upper & lower case characters, 1 or more numbers & special characters.');
    await this.page.getByRole('button', { name: 'Continue' }).click();

  }

  async emailVerification(code: string) {
    await expect(this.page.getByRole('heading')).toContainText('Verify Email');
    await expect(this.page.getByRole('textbox', { name: 'Verification code' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Verification code' })).toBeEmpty();
    await this.page.getByRole('textbox', { name: 'Verification code' }).click();
    await this.page.getByRole('textbox', { name: 'Verification code' }).fill(code);
    await this.page.getByRole('button', { name: 'Verify' }).click({ timeout: 60000 });
    await expect(this.page.getByRole('heading', { name: 'Sign In to Maltego' })).toBeVisible({ timeout: 20000 });
  }

  async verifySignUpErrorMessage() {
    await expect(this.page.getByRole('heading')).toContainText('Create Maltego ID');
    await expect(this.page.getByRole('heading', { name: 'Sign In to Maltego' })).toBeVisible({ timeout: 20000 });
    await expect(this.page.getByRole('alert')).toContainText('This email address is already in use.');
  }

  async loginWithNewAccount(emailAddress: string, password: string) {
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await expect(this.page.getByRole('button', { name: 'Sign in' })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Email' })).toHaveValue(emailAddress);
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeEmpty();
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await Promise.all([
        this.page.waitForURL('https://login.maltego.com/**', { timeout: 20000 }),
        await this.page.getByRole('button', { name: 'Sign in' }).click(), 
    ]);

  }

  async comlpleteProfile ( phone: string, orgName: string, role: string) {

    await expect(this.page.locator('body')).toContainText('Complete Your Profile',{ timeout: 60000 });
    await expect(this.page.locator('div').filter({ hasText: 'First Name *Last Name *Are' }).nth(1)).toBeVisible()
    await expect(this.page.locator('body')).toContainText('Are you a student?',{ timeout: 60000 });
    await this.page.getByRole('radio', { name: 'Yes' }).check();
    await expect(this.page.getByText('Country *')).toBeVisible();
    await this.page.getByRole('combobox', { name: 'Country' }).click();
    await this.page.getByRole('option', { name: 'Germany' }).click();
    await this.page.locator('[name=\"phone\"]').click();
    await this.page.locator('[name=\"phone\"]').fill(phone);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  
    await expect(this.page.getByRole('textbox', { name: 'Organization Name' })).toBeEmpty();
    await expect(this.page.locator('body')).toContainText('Organization Name *');
    await expect(this.page.locator('body')).toContainText('Organization Size *');
    await expect(this.page.locator('body')).toContainText('Business Role *');
    await expect(this.page.locator('body')).toContainText('Your Role *');
    await expect(this.page.locator('body')).toContainText('Main Use Cases *');
    await expect(this.page.locator('body')).toContainText('How did you first learn about Maltego?');
    await expect(this.page.getByText('Focus of Business Unit *')).toBeVisible();
    await this.page.getByRole('textbox', { name: 'Organization Name' }).click();
    await this.page.getByRole('textbox', { name: 'Organization Name' }).fill(orgName);
    await this.page.getByRole('combobox', { name: 'Organization Size' }).click();
    await this.page.getByRole('option', { name: '1-10', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Your Role' }).click();
    await this.page.getByRole('textbox', { name: 'Your Role' }).fill(role);
    await this.page.getByRole('textbox', { name: 'Organization website' }).click();
    await this.page.getByRole('combobox', { name: 'How did you first learn about' }).click();
    await this.page.getByRole('option', { name: 'Social Media' }).click();
    await this.page.getByRole('combobox', { name: 'Focus of Business Unit' }).click();
    await this.page.getByRole('option', { name: 'Trust & Safety' }).click();
    await this.page.locator('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root').click();
    await this.page.getByRole('option', { name: 'Incident Response' }).click();
    await this.page.getByRole('button', { name: 'Close' }).click();
    await expect(this.page.locator('body')).toContainText('Continue');
    await Promise.all([
      this.page.waitForURL('https://app.maltego.com/**', { timeout: 20000 }),
      await this.page.getByRole('button', { name: 'Continue' }).click(),
    ]);

  }

}