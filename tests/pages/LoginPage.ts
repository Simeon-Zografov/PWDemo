import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginTitle: Locator;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTitle = page.locator('//h2');
    this.usernameField = page.locator('#username');
    this.passwordField = page.locator('#password');
    this.loginButton = page.locator('//button');
    this.errorMessage = page.locator('#flash');
  }

  async isLoginTitleVisible(): Promise<boolean> {
    return this.loginTitle.isVisible();
  }

  async setUsername(username: string): Promise<void> {
    await this.usernameField.fill(username);
  }

  async setPassword(password: string): Promise<void> {
    await this.passwordField.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }

  async completeLogin(username: string, password: string): Promise<void> {
    await this.setUsername(username);
    await this.setPassword(password);
    await this.clickLogin();
  }

  async getErrorMessageText(): Promise<string> {
    return (await this.errorMessage.textContent())?.trim() || '';
  }
}
