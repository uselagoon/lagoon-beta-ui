import { Page, Locator } from '@playwright/test';

export default class UsersRepository {
  constructor(private page: Page) {}

  getAddUserBtn(): Locator {
    return this.page.locator('[data-cy=add-user]');
  }

  getAddUserEmail(): Locator {
    return this.page.locator('[data-cy=user-email]');
  }

  async addUserToGroup(): Promise<void> {
    await this.page.locator('[data-cy=group-select]').click();
    await this.getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'lagoon-demo-organization-group' })
      .click();
  }

  async addUserRole(): Promise<void> {
    await this.page.locator('[data-cy=role-select]').click();
    await this.getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'Reporter' })
      .click();
  }

  getDeleteBtnByEmail(email: string): Locator {
    return this.getRows()
      .filter({ hasText: email })
      .locator('[data-cy=user-row]')
      .locator('[data-cy=delete-dialog]');
  }

  getConfirmBtn(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }

  getRows(): Locator {
    return this.page.locator('[data-cy=user-row]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }
}

