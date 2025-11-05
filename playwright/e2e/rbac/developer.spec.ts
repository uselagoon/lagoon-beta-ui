import { test, expect } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import BackupsAction from '../../support/actions/backups/BackupsAction';
import deploymentAction from '../../support/actions/deployment/DeploymentAction';
import DeploymentsAction from '../../support/actions/deployments/DeploymentsAction';
import EnvOverviewAction from '../../support/actions/envOverview/EnvOverviewAction';
import ProjectAction from '../../support/actions/project/ProjectAction';
import SettingAction from '../../support/actions/settings/SettingsAction';
import TaskAction from '../../support/actions/task/TaskAction';
import TasksAction from '../../support/actions/tasks/TasksAction';
import VariablesAction from '../../support/actions/variables/VariablesAction';
import { env, loginUser, setupGraphQLInterception, waitForGraphQL } from '../../support/test-helpers';

test.describe('DEVELOPER permission test suites', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_developer);
  });

  test.describe('Settings', () => {
    test('Adds SSH key', async ({ page }) => {
      await page.goto(`${env.url}/settings`);
      const settings = new SettingAction(page);
      await settings.addSshKey(testData.ssh.name, testData.ssh.value);
    });

    test('Deletes SSH key', async ({ page }) => {
      await page.goto(`${env.url}/settings`);
      const settings = new SettingAction(page);
      await settings.deleteSshKey(testData.ssh.name);
    });
  });

  test.describe('Project overview', () => {
    test('Checks environment routes', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo`);
      const project = new ProjectAction(page);
      await project.doEnvRouteCheck();
    });

    test('Creates environment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo`);
      const project = new ProjectAction(page);
      await project.doCreateDummyEnv(page);
    });
  });

  test.describe('Variables', () => {
    test('Checks for no variables set', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/project-variables`);
      await expect(page.locator('[data-cy="empty"]')).toBeVisible();
    });

    test('Fails to add a variable - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/project-variables`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      await page.waitForLoadState('networkidle');

      const { name, value } = testData.variables[0];
      const variable = new VariablesAction(page);
      await variable.doAddVariable(name, value, page);

      const responseBody = await waitForGraphQL(page, 'addEnvVariable', true);
      expect(responseBody).toHaveProperty('errors');
      const errorMessage = 'Unauthorized: You don\'t have permission to "project:add" on "env_var"';
      expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
    });
  });

  test.describe('Environment overview', () => {
    test('Checks environment details', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main`);
      const environmentOverview = new EnvOverviewAction(page);
      await environmentOverview.doEnvTypeCheck();
      await environmentOverview.doDeployTypeCheck();
      await environmentOverview.doSourceCheck();
      await environmentOverview.doRoutesCheck();
    });

    test('Fails to delete PROD - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const environmentOverview = new EnvOverviewAction(page);
      await environmentOverview.doDeleteEnvironmentError('main', page);
    });

    test('Deletes staging environment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-staging`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const environmentOverview = new EnvOverviewAction(page);
      await environmentOverview.doDeleteEnvironment('staging', page);
    });
  });

  test.describe('Deployments', () => {
    test('Fails to do a PROD deployment - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doFailedDeployment(page);
    });

    test('Does a staging deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-staging/deployments`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doDeployment(page);
    });

    test('Fails to cancel any deployment - no permission to CANCEL for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doFailedCancelDeployment(page);
    });
  });

  test.describe('Deployment', () => {
    test('Fails to cancel deployment - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployment = new deploymentAction(page);
      await deployment.navigateToRunningDeployment(page);
      await page.waitForTimeout(2000);
      await deployment.doFailedCancelDeployment(page);
    });
  });

  test.describe('Backups', () => {
    test('Checks backup retrieve btns', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/backups`);
      await page.waitForLoadState('networkidle');
      const backups = new BackupsAction(page);
      await backups.doCheckAllRetrieveButtons();
    });
  });

  test.describe('Tasks', () => {
    test('Fails to cancel a running task - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const tasks = new TasksAction(page);
      await tasks.doFailedTaskCancellation(page);
    });

    test('Runs cache clear', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doCacheClearTask(page);
    });

    test('Runs drush cron', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doDrushCronTask(page);
    });

    test('Generates DB backup', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doDbBackupTask(page);
    });

    test('Does a developer task', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doDeveloperTask(page);
    });

    test('Generates DB/Files backup', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doDbAndFilesBackupTask(page);
    });

    test('Fails to generate login link - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const tasks = new TasksAction(page);
      await tasks.doFailedLoginLinkTask(page);
    });
  });

  test.describe('Task Page', () => {
    test('Fails to cancel a running task - no permission for DEVELOPER', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const task = new TaskAction(page);
      await task.doNavToRunningTask(page);
      await task.doFailedCancelTask(page);
    });
  });
});

