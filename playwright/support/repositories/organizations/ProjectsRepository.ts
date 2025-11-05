import { Page, Locator } from '@playwright/test';

export default class ProjectsRepository {
  constructor(private page: Page) {}

  getAddBtn(): Locator {
    return this.page.locator('[data-cy=create-project]');
  }

  getConfirmBtn(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }

  getNameInput(): Locator {
    return this.page.locator('[data-cy=project-name]');
  }

  getGitInput(): Locator {
    return this.page.locator('[data-cy=git-url]');
  }

  getEnvInput(): Locator {
    return this.page.locator('[data-cy=prod-environment]');
  }

  getProjectRows(): Locator {
    return this.page.locator('[data-cy=org-project-row]');
  }

  getDeleteBtn(projectName: string): Locator {
    return this.getProjectRows()
      .filter({ hasText: projectName })
      .locator('xpath=ancestor::*[@data-cy="org-project-row"]')
      .locator('[data-cy=delete]');
  }

  getDeleteConfirm(): Locator {
    return this.page.locator('[data-cy=delete-confirm-input]');
  }

  getScopeSelector(): Locator {
    return this.page.locator('[data-cy=select-scope]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }

  async selectTarget(): Promise<void> {
    await this.getScopeSelector().click();
    await this.getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'ui-kubernetes' })
      .click();
  }
}

