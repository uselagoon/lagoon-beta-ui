import { Page, Locator } from '@playwright/test';

export default class VariablesRepository {
  constructor(private page: Page) {}

  getVariablesLink(): Locator {
    return this.page.locator('[data-cy=nav-variables]');
  }

  getToggleShowButton(): Locator {
    return this.page.locator('[data-cy=var-visibility-toggle]');
  }

  getAddButton(): Locator {
    return this.page.locator('[data-cy=add-variable]');
  }

  getEnvDataRows(): Locator {
    return this.page.locator('[data-cy=variable-row]');
  }

  getVariableToDelete(): Locator {
    return this.page.locator('[data-cy=variable-row]');
  }

  getDeleteBtn(name: string): Locator {
    return this.getVariableToDelete()
      .filter({ hasText: name })
      .locator('xpath=ancestor::*[@data-cy="variable-row"]')
      .locator('[data-cy=delete-button]');
  }
}

