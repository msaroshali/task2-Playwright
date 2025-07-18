import { expect, type Locator, type Page } from '@playwright/test';

export class PasswordResetPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;

  }

  async goto() {

    await this.page.getByTestId('user-avatar').click();
    await expect(this.page.getByRole('menu')).toContainText('reset pass');
    await expect(this.page.locator('body')).toContainText('Private Organization');
    await expect(this.page.getByRole('menu')).toContainText('My Profile');
    await this.page.getByRole('menuitem', { name: 'My Profile' }).click();
    await expect(this.page.getByText('EmailPrefer to use a different account?LogoutE-Mail *First name *Last name *')).toBeVisible();
  }
 
 
  async verifyPageAndResetPassword(newPassword: string) {
    await expect(this.page.locator('div').filter({ hasText: 'My Profile' }).nth(2)).toBeVisible();
    await expect(this.page.getByRole('heading')).toContainText('My Profile');
    await expect(this.page.getByRole('textbox', { name: 'Password' })).toBeEmpty();  
    await this.page.getByRole('textbox', { name: 'Password' }).click();
    await this.page.getByRole('textbox', { name: 'Password' }).fill(newPassword);
    await this.page.locator('form').filter({ hasText: 'Password *Save' }).getByRole('button').click();
  }

  // This method verifies the reset and logs out of the account
  async verifyPasswordReset() {
    await expect(this.page.getByLabel('Your changes have been saved')).toContainText('Your changes have been saved and will be reflected upon your next login.');
    await this.page.getByRole('button', { name: 'OK' }).click();
  //    await expect(this.page.getByRole('button', { name: 'Back to Maltego' })).toBeVisible();
    await this.page.getByRole('button', { name: 'Back to Maltego' }).click();

    await expect(this.page.getByTestId('user-avatar')).toBeVisible();
    await this.page.getByTestId('user-avatar').click();
    await this.page.getByText('Logout').click();
  }

  // sign out from the account
  async verifyChangeAndSignOut() {
    await expect(this.page.getByLabel('Your changes have been saved')).toContainText('Your changes have been saved and will be reflected upon your next login.');
    await this.page.getByRole('button', { name: 'OK' }).click();
    await expect(this.page.getByText('Prefer to use a different')).toBeVisible();
    await this.page.getByRole('link', { name: 'Logout' }).click();
    await this.page.getByTestId('user-avatar').click();
    await this.page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(this.page.getByRole('heading')).toContainText('Login to Maltego');
    await expect(this.page.getByRole('heading')).toContainText('Login to Maltego');
  }
}