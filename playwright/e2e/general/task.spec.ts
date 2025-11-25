import { test } from '@playwright/test';
import TaskAction from '../../support/actions/task/TaskAction';
import TasksAction from '../../support/actions/tasks/TasksAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Task page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Runs a task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    await page.waitForLoadState('networkidle');
    const tasks = new TasksAction(page);
    await tasks.doCacheClearTask(page);
  });

  test('Cancels a running task', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
    const task = new TaskAction(page);
    await task.doNavToRunningTask(page);
    await task.doCancelTask(page);
  });
});

