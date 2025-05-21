# task2-Playwright

This project automates authentication-related front-end functionality for the [Maltego website](https://app.maltego.com) using [Playwright](https://playwright.dev/) with TypeScript.

## 📌 Project Overview

The following user workflows are tested:

- **Account Signup**  
  Automates creation of a new account with email verification.

- **Login Operations**  
  Tests login functionality with:
  - Valid credentials
  - Invalid credentials

- **Password Reset**  
  The test flow for password reset includes:
  1. Logging in to an existing account with the original password
  2. Resetting the password to a new one
  3. Logging in with the new password
  4. Resetting the password back to the original


## Tech Stack

- [Playwright](https://playwright.dev/) with TypeScript
- Page Object Model for code reusability
- Data-driven testing using external JSON files
- GitHub Actions CI workflow
- Automated Email verification using Mailosaur API


