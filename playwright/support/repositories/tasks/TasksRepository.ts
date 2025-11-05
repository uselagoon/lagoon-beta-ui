import { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export default class TasksRepository {
  static numberToTask: { [key: string]: string } = {
    '0': 'Clear Drupal caches',
    '1': 'Run Drupal cron',
    '2': 'Copy database between environments',
    '3': 'Copy files between backup',
    '4': 'Copy files between environments',
    '5': 'Generate database backup',
    '6': 'Generate database and files backup',
    '7': 'Generate login link',
    '8': 'A task that only maintainers can run',
    '9': 'A task that developers can run',
  };

  constructor(private page: Page) {}

  getTasks(): Locator {
    return this.page.locator('[data-cy=task-row]');
  }

  getCancelBtn(): Locator {
    return this.getTasks().first().locator('[data-cy=cancel-task]');
  }

  getTaskSelector(taskNumber: number): Locator {
    const selectedTask = TasksRepository.numberToTask[String(taskNumber)];
    return this.page
      .locator('[data-cy=task-select]')
      .locator('.ant-select-tree-title')
      .filter({ hasText: selectedTask });
  }

  getRunTaskBtn(): Locator {
    return this.page.locator('[data-cy=task-btn]');
  }

  async getTaskConfirmed(): Promise<void> {
    await expect(this.page.locator('[data-cy=task-row]').first()).toContainText('a few seconds ago');
  }

  getResultsLimited(): Locator {
    return this.page.locator('[data-cy=resultsLimited]');
  }

  getResultsSelector(): Locator {
    return this.page.locator('[data-cy=result_selector]');
  }

  getNotification(): Locator {
    return this.page.locator('.ant-notification-notice');
  }

  getResultSelector(): Locator {
    return this.page.locator('[data-cy=select-results]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }
}
