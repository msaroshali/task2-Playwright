import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-Objects/login-page';
import { HomePage } from '../page-Objects/home-page';
import { PasswordResetPage } from '../page-Objects/reset-pass';
import passwordResetData from '../test-data/passwordResetData.json';



// The test below is for the password reset process, for an account 
// that already pre-exists. No new acounts are created.

// The test begins with: 
// loggin in with the original password,
// then it attempts to reset the password to a new password,
// and finally attempts to reset the password back to the original password
test('login to an existing account and change password ', async ({ page }) => {
    
    const passwordResetPage = new PasswordResetPage(page);
    const loginPage = new LoginPage(page);
    const homepage = new HomePage(page);

    // Navigate to the login page and get started
    await loginPage.goto();
    await loginPage.acceptCookies();

    // Login with the original password to be changed
    await loginPage.login(passwordResetData.email, passwordResetData.originalPass);
    await homepage.verifyHomePageVisible();
    
    // Attempt to reset the password to a new password
    await passwordResetPage.goto();
    await passwordResetPage.verifyPageAndResetPassword(passwordResetData.newPass);
    
    // Verify the password reset was successful and log out
    await passwordResetPage.verifyPasswordReset();

    // Login with the new password, land on the home page
    await loginPage.loginWithPasswordOnly(passwordResetData.newPass);
    await homepage.verifyHomePageVisible();
    
    // attempt to change the password to the original password
    await passwordResetPage.goto();
    await passwordResetPage.verifyPageAndResetPassword(passwordResetData.originalPass);
      
    // Verify the password reset was successful
    await passwordResetPage.verifyPasswordReset();
});


