import { Page, expect } from '@playwright/test';
import BackupsRepository from '../../repositories/backups/BackupsRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class BackupsAction {
  private backups: BackupsRepository;

  constructor(page: Page) {
    this.backups = new BackupsRepository(page);
  }

  async doRetrieveBackup(page: Page): Promise<void> {
    await this.backups.getRetrieveButton().first().click();
    await waitForGraphQL(page, 'addRestore', true);
  }

  async doCheckAllRetrieveButtons(): Promise<void> {
    const backups = this.backups.getBackups();
    await expect(backups).toHaveCount(4);

    const count = await backups.count();
    for (let idx = 0; idx < Math.min(3, count); idx++) {
      const row = backups.nth(idx);
      const retrieveButton = row.locator('[data-cy="retrieve"]');
      const retrievingButton = row.locator('[data-cy="retrieving"]');

      const retrieveCount = await retrieveButton.count();
      const retrievingCount = await retrievingButton.count();

      expect(retrieveCount + retrievingCount).toBeGreaterThan(0);
    }
  }

  async doChangeNumberOfResults(val: string | number, page: Page): Promise<void> {
    await this.backups.getResultSelector().click();
    await this.backups
      .getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: String(val) })
      .click();

    const expectedLimit = val !== 'All' ? `?results=${val}` : '?results=-1';
    await expect(page).toHaveURL(new RegExp(`.*${expectedLimit.replace('?', '\\?')}`));
  }
}

