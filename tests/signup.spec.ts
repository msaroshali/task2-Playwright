import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';
import { SignUpPage } from '../page-Objects/signup-page';
import signUpData from '../test-data/signUpData.json';

const MailosaurClient = require("mailosaur");

// Test for signing up for an account

test('Sign Up', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homepage = new HomePage(page);
  const signup = new SignUpPage(page);

  // Initializing the Mailosaur client with API key establishing Mailosaur Email address
  const mailosaur = new MailosaurClient(signUpData.apiKey);
  const emailAddress = mailosaur.servers.generateEmailAddress(signUpData.serverID);

  // Navigate to the login page and get started
  await loginPage.goto();
  await loginPage.acceptCookies();

  // Verify the login page 
  await loginPage.verifyLoginPageVisible();

  //Begin the sign up process
  await expect(page.locator('body')).toContainText('No Maltego Account?Create ID');
  await expect(page.getByRole('link', { name: 'Create ID' })).toBeVisible();
  await page.getByRole('link', { name: 'Create ID' }).click();
  
  // Verify the create account page
  await signup.verifySignUpPageVisible();

  // Fill in the sign up details
  await signup.fillSignUpDetails(emailAddress, signUpData.firstName, signUpData.lastName, signUpData.password);

  // Mailosaur api call to retrieve verification code 
  const message = await mailosaur.messages.get(signUpData.serverID, {
    sentTo: emailAddress,
  });
  const code = (message.html.codes[0]);

  // verification of email with the verifiation code
  await signup.emailVerification(code.value.toString());

  // Try to login with the new account
  await signup.loginWithNewAccount(emailAddress, signUpData.password);

  // Complete the Profile 
  await signup.comlpleteProfile(signUpData.phone, signUpData.orgName, signUpData.role);
    

  // Verify successful home page landing 
  await homepage.verifyHomePageVisible();
});