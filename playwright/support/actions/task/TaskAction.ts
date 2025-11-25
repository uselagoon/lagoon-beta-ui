import { Page, expect } from '@playwright/test';
import TaskRepository from '../../repositories/task/TaskRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class TaskAction {
  private task: TaskRepository;

  constructor(page: Page) {
    this.task = new TaskRepository(page);
  }

  async doNavToRunningTask(page: Page): Promise<void> {
    await page
      .locator('[data-cy="task-row"]')
      .locator('span.ant-tag')
      .filter({ hasText: 'New' })
      .first()
      .locator('xpath=ancestor::*[@data-cy="task-row"]')
      .locator('a')
      .first()
      .click();
  }

  async doCancelTask(page: Page): Promise<void> {
    await this.task.getCancelBtn().first().click();
    await waitForGraphQL(page, 'cancelTask', true);
    await this.task.getCancelBtn().first();
  }

  async doFailedCancelTask(page: Page): Promise<void> {
    await this.task.getCancelBtn().first().click();
    await waitForGraphQL(page, 'cancelTask', true);
    await expect(this.task.getErrorNotification()).toBeVisible();
    await expect(this.task.getErrorNotification()).toContainText('There was a problem cancelling a task.');
  }
}

