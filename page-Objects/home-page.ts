import { expect, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async verifyHomePageVisible() {
    await expect(this.page.getByLabel('Top Bar')).toBeVisible();
    await expect(this.page.getByTestId('user-avatar')).toBeVisible();
    await expect(this.page.getByText('AdminUsersProductsData')).toBeVisible();
    await expect(this.page.locator('#admin-widget')).toContainText('Admin');
    await expect(this.page.locator('#admin-widget')).toContainText('Users');
  }
}
