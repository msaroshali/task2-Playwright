import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';
import userData from '../test-data/loginData.json';


test('valid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  // Login to the application and land on the home page
  await loginPage.login(userData.validUser.email, userData.validUser.password);
  await homepage.verifyHomePageVisible();
});

test('invalid login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  // Try to login to the application and fail
  await loginPage.loginInvalid(userData.invalidUser.email, userData.invalidUser.password);
  await loginPage.verifyLoginErrorMessage();
});