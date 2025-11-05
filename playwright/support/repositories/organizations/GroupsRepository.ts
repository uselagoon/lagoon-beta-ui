import { Page, Locator } from '@playwright/test';

export default class GroupsRepository {
  constructor(private page: Page) {}

  getElement(selector: string): Locator {
    return this.page.locator(`[data-cy=${selector}]`);
  }

  getAddGroupBtn(): Locator {
    return this.getElement('add-group');
  }

  getAddUserBtn(groupToAddTo: string): Locator {
    return this.getContainingRow(groupToAddTo)
      .locator('xpath=ancestor::*[@data-cy="group-row"]')
      .locator('[data-cy=add-user]');
  }

  getDeleteGroupBtn(): Locator {
    return this.getElement('delete-dialog');
  }

  getGroupRows(): Locator {
    return this.getElement('group-row');
  }

  getEmpty(): Locator {
    return this.getElement('empty');
  }

  getSearchBar(): Locator {
    return this.getElement('search-bar');
  }

  getUserNameInput(): Locator {
    return this.getElement('user-email');
  }

  getGroupNameInput(): Locator {
    return this.getElement('group-name');
  }

  getModalConfirmBtn(): Locator {
    return this.getElement('modal-confirm');
  }

  getContainingRow(groupName: string): Locator {
    return this.getElement('group-row').filter({ hasText: groupName });
  }

  getResultSelector(): Locator {
    return this.page.locator('[data-cy=user-role]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }

  getTotalLabel(): Locator {
    return this.page.locator('[data-cy=total]');
  }
}

