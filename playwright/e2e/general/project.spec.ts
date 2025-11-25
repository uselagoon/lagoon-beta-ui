import { test } from '@playwright/test';
import ProjectAction from '../../support/actions/project/ProjectAction';
import { env, loginUser } from '../../support/test-helpers';

test.describe('Project page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
  });

  test('Navigates from /projects to a project', async ({ page }) => {
    await page.goto(env.url);
    const project = new ProjectAction(page);
    await project.doNavigateToFirst(page);
  });

  test('Checks project detail values/actions', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo`);
    const project = new ProjectAction(page);
    await project.navToDetails(page);
    await project.doClipboardCheck(page);
    await project.doDetailsCheck();
    await project.doExternalLinkCheck();
  });

  test('Checks environment routes', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo`);
    const project = new ProjectAction(page);
    await project.doEnvRouteCheck();
  });

  test('Creates a dummy environment', async ({ page }) => {
    await page.goto(`${env.url}/projects/lagoon-demo`);
    const project = new ProjectAction(page);
    await project.doCreateDummyEnv(page);
  });
});

