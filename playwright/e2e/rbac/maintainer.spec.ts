import { test, expect } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import deploymentAction from '../../support/actions/deployment/DeploymentAction';
import DeploymentsAction from '../../support/actions/deployments/DeploymentsAction';
import EnvOverviewAction from '../../support/actions/envOverview/EnvOverviewAction';
import ProjectAction from '../../support/actions/project/ProjectAction';
import SettingAction from '../../support/actions/settings/SettingsAction';
import TaskAction from '../../support/actions/task/TaskAction';
import TasksAction from '../../support/actions/tasks/TasksAction';
import VariablesAction from '../../support/actions/variables/VariablesAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('MAINTAINER permission test suites', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_maintainer);
  });

  test.describe('Settings', () => {
    test('Adds SSH key', async ({ page }) => {
      await page.goto(`${env.url}/settings`);
      const settings = new SettingAction(page);
      await settings.addSshKey(testData.ssh.name, testData.ssh.value);
    });

    test('Deletes SSH key', async ({ page }) => {
      await page.goto(`${env.url}/settings`);
      await page.waitForLoadState('networkidle');
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

    test('Adds or updates a variable', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/project-variables`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const { name, value } = testData.variables[0];
      const variable = new VariablesAction(page);
      await variable.doAddVariable(name, value, page);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-cy="variable-row"]').filter({ hasText: name })).toBeVisible();
    });

    test('Toggles Hide/Show values', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/project-variables`);
      const variable = new VariablesAction(page);
      await variable.doHideShowToggle();
      await variable.doValueToggle();
      await variable.doHideShowToggle();
    });

    test('Deletes a variable', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/project-variables`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const { name } = testData.variables[0];
      const variable = new VariablesAction(page);
      await variable.doDeleteVariable(name, page);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('[data-cy="empty"]')).toBeVisible();
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

    test('Fails to delete PROD - no permission for maintainer', async ({ page }) => {
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
    test('Does a PROD deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doDeployment(page);
    });

    test('Does a staging deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-staging/deployments`);
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doDeployment(page);
    });

    test('Cancels a staging deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doCancelDeployment(page);
    });

    test('Cancels a PROD deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployments = new DeploymentsAction(page);
      await deployments.doCancelDeployment(page);
    });
  });

  test.describe('Deployment', () => {
    test('Cancels a deployment', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const deployment = new deploymentAction(page);
      await deployment.navigateToRunningDeployment(page);
      await page.waitForTimeout(2000);
      await deployment.doCancelDeployment(page);
    });
  });

  test.describe('Tasks', () => {
    test('Cancels a running task', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const tasks = new TasksAction(page);
      await tasks.doCancelTask(page);
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

    test('Does a maintainer task', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doMaintainerTask(page);
    });

    test('Generates DB/Files backup', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const tasks = new TasksAction(page);
      await tasks.doDbAndFilesBackupTask(page);
    });

    test('Generates a login link', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const tasks = new TasksAction(page);
      await tasks.doLoginLinkTask(page);
    });
  });

  test.describe('Task Page', () => {
    test('Cancels a running task', async ({ page }) => {
      await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/tasks`);
      await page.waitForLoadState('networkidle');
      const interceptor = setupGraphQLInterception(page);
      interceptor.start();
      const task = new TaskAction(page);
      await task.doNavToRunningTask(page);
      await task.doCancelTask(page);
    });
  });
});

