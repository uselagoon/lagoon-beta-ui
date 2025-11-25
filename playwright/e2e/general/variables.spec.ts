import { test, expect } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import ProjectAction from '../../support/actions/project/ProjectAction';
import VariablesAction from '../../support/actions/variables/VariablesAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Project variables page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    await page.goto(env.url);
    const project = new ProjectAction(page);
    await project.doNavigateToFirst(page);
    const environment = new VariablesAction(page);
    await environment.doEnvNavigation();
  });

  test('Checks for no variables set', async ({ page }) => {
    await expect(page.locator('[data-cy="empty"]')).toBeVisible();
  });

  test('Adds or updates a variable', async ({ page }) => {
    const { name, value } = testData.variables[0];
    const environment = new VariablesAction(page);
    await environment.doAddVariable(name, value, page);

    const interceptor = setupGraphQLInterception(page);
    interceptor.start();

    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-cy="variable-row"]').filter({ hasText: name })).toBeVisible();
  });

  test('Toggles Hide/Show values', async ({ page }) => {
    const environment = new VariablesAction(page);
    await environment.doHideShowToggle();
    await environment.doValueToggle();
    await environment.doHideShowToggle();
  });

  test('Deletes a variable', async ({ page }) => {
    const { name } = testData.variables[0];
    const environment = new VariablesAction(page);
    await environment.doDeleteVariable(name, page);

    const interceptor = setupGraphQLInterception(page);
    interceptor.start();

    await page.waitForLoadState('networkidle');
    await expect(page.locator('[data-cy="empty"]')).toBeVisible();
  });
});

