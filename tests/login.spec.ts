import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';
import loginData from '../test-data/loginData.json';
import dotenv from 'dotenv';
dotenv.config();

//Tests for performing login operations with valid and invalid credentials

// Test for a valid login
test('valid login', async ({ page }) => {
  const username = process.env.login_email || '';
  const password = process.env.login_password || '';
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  // Login to the application and land on the home page

  await loginPage.login(username, password);
  await homepage.verifyHomePageVisible();
});

// Test for an invalid login
test('invalid login', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  // Try to login to the application and fail
  await loginPage.loginInvalid(loginData.invalidUser.email, loginData.invalidUser.password);
  await loginPage.verifyLoginErrorMessage();
});