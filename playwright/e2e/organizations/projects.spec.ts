import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import ProjectsActions from '../../support/actions/organizations/ProjectsActions';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Org Projects page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/projects`);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.waitForLoadState('networkidle');
  });

  test('Adds a project', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const project = new ProjectsActions(page);
    await project.doAddProject(testData.organizations.project, page);
  });

  test('Deletes a project', async ({ page }) => {
    const project = new ProjectsActions(page);
    await project.doDeleteProject(testData.organizations.project.projectName, page);
  });
});

