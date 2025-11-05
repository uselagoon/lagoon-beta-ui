import { test } from '@playwright/test';
import deploymentAction from '../../support/actions/deployment/DeploymentAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Deployment page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Cancels a deployment', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    await page.waitForLoadState('networkidle');
    const deployment = new deploymentAction(page);
    await deployment.navigateToRunningDeployment();
    await page.waitForLoadState('networkidle');
    await deployment.doCancelDeployment(page);
  });

  test('Toggles logviewer parsed/raw', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    await page.waitForLoadState('networkidle');
    const deployment = new deploymentAction(page);
    await deployment.navigateToRunningDeployment();
    await deployment.doToggleLogViewer();
  });

  test('Checks accordion headings toggling content', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/deployments`);
    await page.waitForLoadState('networkidle');
    const deployment = new deploymentAction(page);
    await deployment.navigateToRunningDeployment();
    await deployment.doLogViewerCheck();
  });
});

