import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';

test('has title', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  // Login to the application and land on the home page
  await loginPage.login('Your Email', 'Your Password');
  await homepage.verifyHomePageVisible();
});