import { Page, Locator } from '@playwright/test';

export default class BackupsRepository {
  constructor(private page: Page) {}

  getRetrieveButton(): Locator {
    return this.page.locator('[data-cy=retrieve]');
  }

  getBackups(): Locator {
    return this.page.locator('[data-cy=backup-row]');
  }

  getResultSelector(): Locator {
    return this.page.locator('[data-cy=select-results]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }
}

