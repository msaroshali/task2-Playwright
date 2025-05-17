import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';
import signUpData from '../test-data/signUpData.json';

const MailosaurClient = require("mailosaur");

// Test for a valid login
test('Sign Up', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);
  
  // Initializing the Mailosaur client with API key
  const mailosaur = new MailosaurClient(signUpData.apiKey);

  // Email address for the test
  const emailAddress = mailosaur.servers.generateEmailAddress(signUpData.serverID);

  // Navigate to the login page and get started
   await loginPage.goto();
   await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  //Begin the signup process
  await expect(page.locator('body')).toContainText('No Maltego Account?Create ID');
  await expect(page.getByRole('link', { name: 'Create ID' })).toBeVisible();
  await page.getByRole('link', { name: 'Create ID' }).click();
  
  // // Verify the create account page
  await expect(page.getByRole('img', { name: 'maltego-logo' })).toBeVisible();
  await expect(page.getByRole('heading')).toContainText('Create Maltego ID');
  await expect(page.getByRole('textbox', { name: 'E-Mail' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'First name' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Last name' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
  await expect(page.locator('form')).toContainText('E-Mail *');
  await expect(page.locator('form')).toContainText('First name *');
  await expect(page.locator('form')).toContainText('Last name *');
  await expect(page.getByRole('textbox', { name: 'E-Mail' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'First name' })).toBeEmpty();
  await expect(page.getByRole('textbox', { name: 'Last name' })).toBeEmpty();

  // // Fill in the form
  await page.getByRole('textbox', { name: 'E-Mail' }).click();
  await page.getByRole('textbox', { name: 'E-Mail' }).fill(emailAddress); 
  await page.getByRole('textbox', { name: 'E-Mail' }).press('Tab');
  
  await page.getByRole('textbox', { name: 'First name' }).fill('example');
  await page.getByRole('textbox', { name: 'First name' }).press('Tab');
  await page.getByRole('textbox', { name: 'Last name' }).fill('maltego');
  await page.getByRole('button', { name: 'Continue' }).click();
  
  // // Set a password
  await expect(page.getByRole('heading')).toContainText('Create Maltego ID');
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.locator('button[name="method"]')).toContainText('Continue');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Malteg22O@$f2');
  await expect(page.locator('body')).toContainText('Use 8–64 letters, upper & lower case characters, 1 or more numbers & special characters.');
  await page.getByRole('button', { name: 'Continue' }).click();

  // // Retrieve the verification code from Mailosaur
  const message = await mailosaur.messages.get(signUpData.serverID, {
    sentTo: emailAddress,
  });
  const codeInHtml = message.html.codes[0];

  // // verification of email with the emailed verifiation code
  await expect(page.getByRole('heading')).toContainText('Verify Email');
  await expect(page.getByRole('textbox', { name: 'Verification code' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Verification code' })).toBeEmpty();
  await page.getByRole('textbox', { name: 'Verification code' }).click();
  await page.getByRole('textbox', { name: 'Verification code' }).fill(codeInHtml.value.toString());
  await page.getByRole('button', { name: 'Verify' }).click({ timeout: 60000 });
  await expect(page.getByRole('heading', { name: 'Sign In to Maltego' })).toBeVisible({ timeout: 20000 });


  // // Try to login with the new account
  await page.getByRole('textbox', { name: 'Password' }).click();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue(emailAddress);
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeEmpty();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(signUpData.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page.getByText('We use cookies to personalise')).toBeVisible();
  await page.getByRole('link', { name: 'Yes' }).click({ timeout: 60000 });
  //Complete remaining steps 
  await expect(page.locator('body')).toContainText('Complete Your Profile');
  await expect(page.locator('div').filter({ hasText: 'First Name *Last Name *Are' }).nth(1)).toBeVisible();

  await expect(page.locator('body')).toContainText('Are you a student?',{ timeout: 60000 });
  await page.getByRole('radio', { name: 'Yes' }).check();
  await expect(page.getByText('Country *')).toBeVisible();
  await page.getByRole('combobox', { name: 'Country' }).click();
  await page.getByRole('option', { name: 'Germany' }).click();
  await page.locator('[name=\"phone\"]').click();

  
  await page.locator('[name=\"phone\"]').fill(signUpData.phone);
  await page.getByRole('button', { name: 'Continue' }).click();
  await expect(page.getByRole('textbox', { name: 'Organization Name' })).toBeEmpty();
  await expect(page.locator('body')).toContainText('Organization Name *');
  await expect(page.locator('body')).toContainText('Organization Size *');

  await expect(page.locator('body')).toContainText('Business Role *');
  await expect(page.locator('body')).toContainText('Your Role *');
  await expect(page.locator('body')).toContainText('Main Use Cases *');
  await expect(page.locator('body')).toContainText('How did you first learn about Maltego?');

  await expect(page.getByText('Focus of Business Unit *')).toBeVisible();
  await page.getByRole('textbox', { name: 'Organization Name' }).click();
  await page.getByRole('textbox', { name: 'Organization Name' }).fill(signUpData.orgName);

  await page.getByRole('combobox', { name: 'Organization Size' }).click();
  await page.getByRole('option', { name: '1-10', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your Role' }).click();
  await page.getByRole('textbox', { name: 'Your Role' }).fill(signUpData.role);

  await page.getByRole('textbox', { name: 'Organization website' }).click();
  await page.getByRole('combobox', { name: 'How did you first learn about' }).click();
  await page.getByRole('option', { name: 'Social Media' }).click();

  await page.getByRole('combobox', { name: 'Focus of Business Unit' }).click();
  await page.getByRole('option', { name: 'Trust & Safety' }).click();
  await page.locator('.MuiAutocomplete-root > .MuiFormControl-root > .MuiInputBase-root').click();
  await page.getByRole('option', { name: 'Incident Response' }).click();
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('body')).toContainText('Continue');
  await page.getByRole('button', { name: 'Continue' }).click();

  await page.goto('https://app.maltego.com/');
  await expect(page.getByRole('heading')).toContainText('Sign In to Maltego');
  await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(signUpData.password);
  page.getByRole('button', { name: 'Sign in' }).click();

  // Login to the application and land on the home page
  await loginPage.loginDuringSignUp(signUpData.password);
  await homepage.verifyHomePageVisible();
});