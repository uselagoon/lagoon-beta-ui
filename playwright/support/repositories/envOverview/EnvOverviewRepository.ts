import { Page, Locator } from '@playwright/test';

export default class EnvOverviewRepository {
  constructor(private page: Page) {}

  getEnvType(): Locator {
    return this.page.locator('[data-cy=environment-type]');
  }

  getDeployType(): Locator {
    return this.page.locator('[data-cy=deployment-type]');
  }

  getSource(): Locator {
    return this.page.locator('a[data-cy="source"]');
  }

  getRoutes(): Locator {
    return this.page.locator('[data-cy=routes]');
  }

  getDeleteButton(): Locator {
    return this.page.locator('[data-cy=delete]');
  }

  getConfirmInput(): Locator {
    return this.page.locator('[data-cy=input-confirm]').locator('input');
  }

  getDeleteButtonConfirm(): Locator {
    return this.page.locator('.ant-modal-footer').locator('button[type="button"]').filter({ hasText: 'Delete' });
  }

  getNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }
}

