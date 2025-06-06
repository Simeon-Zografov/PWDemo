import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import * as allure from "allure-js-commons";
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const username = process.env.USERNAME!;
const password = process.env.PASSWORD!;

test.describe('Login Suite', () => {

  test('User is navigated to the Login page', async ({ page }) => {
    allure.feature('Login');
    allure.severity('blocker');

    const loginPage = new LoginPage(page);
    await page.goto('/login');

    await test.step('Check the page title', async () => {
      expect(await loginPage.isLoginTitleVisible()).toBeTruthy();
    });
  });

  const invalidLoginData = [
    {
      username: username.slice(0, -1),
      password: password,
      error: 'Your username is invalid!',
    },
    {
      username: username,
      password: password.slice(0, -1),
      error: 'Your password is invalid!',
    },
    {
      username: '',
      password: password,
      error: 'Your username is invalid!',
    },
    {
      username: username,
      password: '',
      error: 'Your password is invalid!',
    },
  ];

  for (const data of invalidLoginData) {
    test(`Unsuccessfully login with username: "${data.username}" and password: "${data.password}"`, async ({ page }) => {
      allure.feature('Login');
      allure.severity('normal');

      const loginPage = new LoginPage(page);
      await page.goto('/login');

      await loginPage.setUsername(data.username);
      await loginPage.setPassword(data.password);
      await loginPage.clickLogin();

      await test.step('Check for error message', async () => {
        expect(await loginPage.errorMessage.isVisible()).toBeTruthy();
      });

      await test.step('Check error message text', async () => {
        const actualError = await loginPage.getErrorMessageText();
        expect(actualError).toContain(data.error);
      });
    });
  }

  test('Successful login', async ({ page }) => {
    allure.feature('Login');
    allure.severity('critical');

    const loginPage = new LoginPage(page);
    await page.goto('/login');

    await loginPage.setUsername(username);
    await loginPage.setPassword(password);
    await loginPage.clickLogin();

    await test.step('The user is logged in', async () => {
      const msg = await loginPage.getErrorMessageText();
      expect(msg).toContain('You logged into a secure area!');
    });
  });

});
