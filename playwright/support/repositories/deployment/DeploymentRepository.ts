import { Page, Locator } from '@playwright/test';

export default class DeploymentRepository {
  constructor(private page: Page) {}

  getCancelDeploymentBtn(): Locator {
    return this.page.locator('[data-cy=cancel-deployment]');
  }

  getConfirmCancelBtn(): Locator {
    return this.page.locator('[data-cy=confirm-cancellation]');
  }

  getDeploymentRow(): Locator {
    return this.page.locator('[data-cy=deployment-row]');
  }

  getToggler(): Locator {
    return this.page.locator('[data-cy=logviewer-toggle]');
  }

  getLogViewer(): Locator {
    return this.page.locator('.log-viewer');
  }

  getAccordionHeadings(): Locator {
    return this.page.locator('.accordion-heading');
  }

  getNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }
}

