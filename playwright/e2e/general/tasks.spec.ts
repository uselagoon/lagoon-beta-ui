import { test } from '@playwright/test';
import TasksAction from '../../support/actions/tasks/TasksAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Tasks page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Cancels a running task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doCancelTask(page);
  });

  test('Starts cache clear task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doCacheClearTask(page);
  });

  test('Starts drush cron', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doDrushCronTask(page);
  });

  test.skip('Generates db backup', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doDbBackupTask(page);
  });

  test('Generates db/files backup', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doDbAndFilesBackupTask(page);
  });

  test('Generates login link', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doLoginLinkTask(page);
  });

  test('Runs maintainer task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doMaintainerTask(page);
  });

  test('Runs developer task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doDeveloperTask(page);
  });

  test('Changes shown tasks results', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    const tasks = new TasksAction(page);
    await tasks.doChangeNumberOfResults(10, page);
    await tasks.doChangeNumberOfResults(25, page);
    await tasks.doChangeNumberOfResults(50, page);
    await tasks.doChangeNumberOfResults(100, page);
    await tasks.doChangeNumberOfResults('All', page);
  });
});

