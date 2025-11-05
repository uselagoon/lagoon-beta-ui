import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export default class DeploymentsRepository {
  constructor(private page: Page) {}

  getDeployBtn(): Locator {
    return this.page.locator('[data-cy=deploy-button]');
  }

  getDeployments(): Locator {
    return this.page.locator('[data-cy=deployment-row]');
  }

  getNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }

  getCancelBtn(): Locator {
    return this.getDeployments().first().locator('[data-cy=cancel-deployment]');
  }

  getConfirmCancelBtn(): Locator {
    return this.page.locator('[data-cy=confirm-cancellation]');
  }

  async getDeploymentTriggered(): Promise<void> {
    await expect(this.getNotification()).toContainText('Deployment successfully triggered');
  }

  getResultSelector(): Locator {
    return this.page.locator('[data-cy=select-results]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }
}
