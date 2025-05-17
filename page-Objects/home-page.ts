import { expect, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Check if landing on home page was successful
  async verifyHomePageVisible() {
    await expect(this.page.getByLabel('Top Bar')).toBeVisible({ timeout: 60000 });
    await expect(this.page.getByTestId('user-avatar')).toBeVisible();
    await expect(this.page.getByText('AdminUsersProductsData')).toBeVisible();
    await expect(this.page.locator('#admin-widget')).toContainText('Admin');
    await expect(this.page.locator('#admin-widget')).toContainText('Users');
  }
}
