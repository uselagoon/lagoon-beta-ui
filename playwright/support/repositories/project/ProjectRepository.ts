import { Page, Locator } from '@playwright/test';

export default class ProjectRepository {
  constructor(private page: Page) {}

  getGitUrl(): Locator {
    return this.page.locator('[data-cy=git-url]');
  }

  getCopyButton(): Locator {
    return this.page.locator('[data-cy=copy-button]');
  }

  getCreatedField(): Locator {
    return this.page.locator('[data-cy=created]');
  }

  getBranchesField(): Locator {
    return this.page.locator('[data-cy=branches-enabled]');
  }

  getPullRequestsField(): Locator {
    return this.page.locator('[data-cy=pull-requests-enabled]');
  }

  getDevEnvsField(): Locator {
    return this.page.locator('[data-cy=development-environments-in-use]');
  }

  getEnvBtn(): Locator {
    return this.page.locator('[data-cy=create-environment]');
  }

  getBranchNameInput(): Locator {
    return this.page.locator('[data-cy=branch-name]');
  }

  getNextStepButton(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }

  getNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }

  getEnvNames(): Locator {
    return this.page.locator('[data-cy=environment-row]');
  }
}

