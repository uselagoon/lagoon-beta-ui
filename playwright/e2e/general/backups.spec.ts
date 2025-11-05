import { test } from '@playwright/test';
import BackupsAction from '../../support/actions/backups/BackupsAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Backups page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Retrieves a backup', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/backups`);
    await page.waitForLoadState('networkidle');
    const backups = new BackupsAction(page);
    await backups.doRetrieveBackup(page);
  });

  test('Changes shown backup results', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo/lagoon-demo-main/backups`);
    await page.waitForLoadState('networkidle');
    const backups = new BackupsAction(page);
    await backups.doChangeNumberOfResults(10, page);
    await backups.doChangeNumberOfResults(25, page);
    await backups.doChangeNumberOfResults(50, page);
    await backups.doChangeNumberOfResults(100, page);
    await backups.doChangeNumberOfResults('All', page);
  });
});

