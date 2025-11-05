import { Page, Locator } from '@playwright/test';

export default class SettingsRepository {
  constructor(private page: Page) {}

  getAddNewKeyButton(): Locator {
    return this.page.locator('[data-cy=add-key]');
  }

  getNameInput(): Locator {
    return this.page.locator('[data-cy=key-name]');
  }

  getValueInput(): Locator {
    return this.page.locator('[data-cy=key-value]');
  }

  getSubmitBtn(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }

  getKeyToDelete(): Locator {
    return this.page.locator('[data-cy=ssh-row]');
  }

  getDeleteConfirmInput(): Locator {
    return this.page.locator('[data-cy=delete-confirm]');
  }

  getDeleteBtn(name: string): Locator {
    return this.getKeyToDelete()
      .filter({ hasText: name })
      .locator('[data-cy=delete-button]');
  }
}

