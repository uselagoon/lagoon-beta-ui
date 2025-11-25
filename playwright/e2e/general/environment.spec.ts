import { test } from '@playwright/test';
import EnvOverviewAction from '../../support/actions/envOverview/EnvOverviewAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Environment page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
  });

  test('Checks environment details', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main`);
    const environmentOverview = new EnvOverviewAction(page);
    await environmentOverview.doEnvTypeCheck();
    await environmentOverview.doDeployTypeCheck();
    await environmentOverview.doSourceCheck();
    await environmentOverview.doRoutesCheck();
  });

  test('Deletes the environment', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main`);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    const environmentOverview = new EnvOverviewAction(page);
    await environmentOverview.doDeleteEnvironment('main', page);
  });
});

