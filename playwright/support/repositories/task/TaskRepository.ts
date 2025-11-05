import { Page, Locator } from '@playwright/test';

export default class TaskRepository {
  constructor(private page: Page) {}

  getCancelBtn(): Locator {
    return this.page.locator('[data-cy=cancel-task]').first();
  }

  getErrorNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }
}

