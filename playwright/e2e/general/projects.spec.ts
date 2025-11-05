import { test } from '@playwright/test';
import { env, loginUser } from '../../support/test-helpers';
import ProjectAction from '../../support/actions/projects/ProjectsAction';

test.describe('Projects page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
  });

  test('Visits projects page', async ({ page }) => {
    await page.goto(env.url);
    const projects = new ProjectAction(page);
    await projects.doPageCheck();
  });

  test('Checks project length and counter value', async ({ page }) => {
    await page.goto(env.url);
    const projects = new ProjectAction(page);
    await projects.doProjectLengthCheck();
  });

  test('Does an empty search', async ({ page }) => {
    await page.goto(env.url);
    const projects = new ProjectAction(page);
    await projects.doEmptySearch();
  });

  test('Searches for projects', async ({ page }) => {
    await page.goto(env.url);
    const projects = new ProjectAction(page);
    await projects.doSearch();
  });

  test('Changes number of projects to display and URL', async ({ page }) => {
    await page.goto(env.url);
    const projects = new ProjectAction(page);
    await projects.doChangeNumberOfResults(20, page);
    await projects.doChangeNumberOfResults(10, page);
    await projects.doChangeNumberOfResults(50, page);
  });
});

