import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import GroupAction from '../../support/actions/organizations/GroupsAction';
import UsersActions from '../../support/actions/organizations/UsersAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Org Users page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/users`);
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Creates a group', async ({ page }) => {
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/groups`);
    const group = new GroupAction(page);
    await group.doAddGroup(testData.organizations.groups.newGroupName, testData.organizations.groups.newGroupName2, page);
  });

  test('Adds a user to the group', async ({ page }) => {
    const users = new UsersActions(page);
    await users.doAddUser(testData.organizations.users.email, page);
  });

  test('Deletes user', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const users = new UsersActions(page);
    await users.doDeleteUser(testData.organizations.users.email);
  });

  test.afterAll(async ({ page }) => {
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/groups`);
    const group = new GroupAction(page);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName, page);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName2, page);
  });
});

