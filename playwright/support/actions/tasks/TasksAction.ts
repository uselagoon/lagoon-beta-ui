import { Page, expect } from '@playwright/test';
import TasksRepository from '../../repositories/tasks/TasksRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class TasksAction {
  private tasks: TasksRepository;

  constructor(page: Page) {
    this.tasks = new TasksRepository(page);
  }

  async doCancelTask(page: Page): Promise<void> {
    await this.tasks.getCancelBtn().first().click();
    await waitForGraphQL(page, 'cancelTask', true);
  }

  async doCacheClearTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(0).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doDrushCronTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(1).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doDbBackupTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(4).click();
    await page.locator('[data-cy="source-env"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'dev' })
      .click();

    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doFailedDbBackupTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(4).click();
    await page.locator('[data-cy="source-env"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'dev' })
      .click();

    await this.tasks.getRunTaskBtn().click();

    const responseBody = await waitForGraphQL(page, 'taskDrushRsyncFiles', true);
    const errorMessage = "Unauthorized: You don't have permission to \"drushRsync:source:development\" on \"task\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doDbAndFilesBackupTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(5).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doFailedDbAndFilesBackupTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(5).click();
    await this.tasks.getRunTaskBtn().click();

    const responseBody = await waitForGraphQL(page, 'taskDrushSqlDump', true);
    const errorMessage = "Unauthorized: You don't have permission to \"drushSqlDump:production\" on \"task\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doLoginLinkTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(7).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doFailedLoginLinkTask(page: Page): Promise<void> {
    await this.tasks.getTaskSelector(7).click();
    await this.tasks.getRunTaskBtn().click();

    const responseBody = await waitForGraphQL(page, 'taskDrushUserLogin', true);
    const errorMessage = "Unauthorized: You don't have permission to \"drushUserLogin:production\" on \"task\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doDeveloperTask(page: Page, taskNum?: number): Promise<void> {
    await this.tasks.getTaskSelector(taskNum || 7).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doMaintainerTask(page: Page, taskNum?: number): Promise<void> {
    await this.tasks.getTaskSelector(taskNum || 8).click();
    await this.tasks.getRunTaskBtn().click();
    await this.tasks.getTaskConfirmed();
  }

  async doFailedTaskCancellation(page: Page): Promise<void> {
    await this.tasks.getCancelBtn().first().click();

    const responseBody = await waitForGraphQL(page, 'cancelTask', true);
    const errorMessage = "Unauthorized: You don't have permission to \"cancel:production\" on \"task\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);

    await expect(this.tasks.getNotification()).toBeVisible();
    await expect(this.tasks.getNotification()).toContainText('There was a problem cancelling a task.');
  }

  async doChangeNumberOfResults(val: string | number, page: Page): Promise<void> {
    await this.tasks.getResultSelector().click();
    await this.tasks
      .getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: String(val) })
      .click();

    const expectedLimit = val !== 'All' ? `?tasks_count=${val}` : '?tasks_count=-1';
    await expect(page).toHaveURL(new RegExp(`.*${expectedLimit.replace('?', '\\?')}`));
  }
}

