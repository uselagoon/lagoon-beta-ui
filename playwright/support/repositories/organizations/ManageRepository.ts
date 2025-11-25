import { Page, Locator } from '@playwright/test';

export default class ManageRepository {
  constructor(private page: Page) {}

  getAddUserBtn(): Locator {
    return this.page.locator('[data-cy=add-admin]');
  }

  getUserEmailField(): Locator {
    return this.page.locator('[data-cy=user-email]');
  }

  getUserRoleDropdown(): Locator {
    return this.page.locator('[data-cy=user-role]');
  }

  getUserAdminRoleOption(): Locator {
    return this.page.locator('.ant-select-item-option-content').filter({ hasText: 'Admin' });
  }

  getUserOwnerRoleOption(): Locator {
    return this.page.locator('.ant-select-item-option-content').filter({ hasText: 'Owner' });
  }

  getUserViewerRoleOption(): Locator {
    return this.page.locator('.ant-select-item-option-content').filter({ hasText: 'Viewer' });
  }

  getConfirmBtn(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }

  getUserRows(): Locator {
    return this.page.locator('[data-cy=admin-row]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }

  getUserByRow(user: string): Locator {
    return this.getUserRows()
      .filter({ hasText: user })
      .locator('xpath=ancestor::*[@data-cy="admin-row"]');
  }

  getUserToDelete(user: string): Locator {
    return this.getUserByRow(user).locator('[data-cy=delete-dialog]');
  }
}

