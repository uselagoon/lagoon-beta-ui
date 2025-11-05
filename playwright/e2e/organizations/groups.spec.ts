import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import GroupAction from '../../support/actions/organizations/GroupsAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Organization Groups page', () => {
  test.beforeEach(async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/groups`);
  });

  test('Adds a group', async ({ page }) => {
    const group = new GroupAction(page);
    await group.doAddGroup(testData.organizations.groups.newGroupName, testData.organizations.groups.newGroupName2, page);
  });

  test('Searches groups', async ({ page }) => {
    const group = new GroupAction(page);
    await group.doGroupSearch(testData.organizations.groups.newGroupName, testData.organizations.groups.newGroupName2);
  });

  test('Adds a member to a group', async ({ page }) => {
    const group = new GroupAction(page);
    await group.doAddMemberToGroup(testData.organizations.users.email, testData.organizations.groups.newGroupName, page);
  });

  test('Deletes groups', async ({ page }) => {
    const group = new GroupAction(page);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName, page);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName2, page);
  });
});

