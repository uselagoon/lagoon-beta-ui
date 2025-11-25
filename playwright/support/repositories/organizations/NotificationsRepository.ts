import { Page, Locator } from '@playwright/test';

export default class NotificationsRepository {
  constructor(private page: Page) {}

  getNotificationRowByName(notification: string): Locator {
    return this.page
      .locator('[data-cy=notification-row]')
      .filter({ hasText: notification })
      .locator('xpath=ancestor::*[@data-cy="notification-row"]');
  }

  getAddNotification(): Locator {
    return this.page.locator('[data-cy=add-notification]');
  }

  getNotificationSelect(): Locator {
    return this.page.locator('[data-cy=notification-type]');
  }

  getSelectMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }

  getNotificationSelectOption(type: string): Locator {
    return this.getSelectMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: new RegExp(type.toUpperCase(), 'i') });
  }

  getEditBtn(notification: string): Locator {
    return this.getNotificationRowByName(notification).locator('[data-cy=edit-notification]');
  }

  getNotificationDelete(notification: string): Locator {
    return this.getNotificationRowByName(notification).locator('[data-cy=delete-dialog]');
  }

  getModalConfirm(): Locator {
    return this.page.locator('[data-cy=modal-confirm]');
  }
}

