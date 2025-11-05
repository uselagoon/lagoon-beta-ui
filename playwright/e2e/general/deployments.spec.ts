import { test } from '@playwright/test';
import DeploymentsAction from '../../support/actions/deployments/DeploymentsAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Deployments page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Does a deployment', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    const deployments = new DeploymentsAction(page);
    await deployments.doDeployment(page);
  });

  test('Cancels a deployment', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    await page.waitForLoadState('networkidle');
    const deployments = new DeploymentsAction(page);
    await deployments.doCancelDeployment(page);
  });

  test('Changes shown results', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    const deployments = new DeploymentsAction(page);
    await deployments.doChangeNumberOfResults(10, page);
    await deployments.doChangeNumberOfResults(25, page);
    await deployments.doChangeNumberOfResults(50, page);
    await deployments.doChangeNumberOfResults(100, page);
    await deployments.doChangeNumberOfResults('All', page);
  });
});

