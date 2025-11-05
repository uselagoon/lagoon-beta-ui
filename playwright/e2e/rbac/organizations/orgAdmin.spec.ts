import { test, expect } from '@playwright/test';
import { testData } from '../../../fixtures/variables';
import GroupAction from '../../../support/actions/organizations/GroupsAction';
import NotificationsAction from '../../../support/actions/organizations/NotificationsAction';
import OverviewAction from '../../../support/actions/organizations/OverviewAction';
import ProjectsActions from '../../../support/actions/organizations/ProjectsActions';
import { env, loginUser, setupGraphQLInterception, waitForGraphQL } from '../../../support/test-helpers';

test.describe('Organizations Org admin journey', () => {
  test.beforeEach(async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await loginUser(page, env.user_orgadmin);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization`);
  });

  test('Fails to change org name and desc - no permission for ORGADMIN', async ({ page }) => {
    const overview = new OverviewAction(page);
    await overview.doFailedChangeOrgFriendlyname(testData.organizations.overview.friendlyName, page);
    await overview.closeModal();
    await overview.doFailedChangeOrgDescription(testData.organizations.overview.description, page);
    await overview.closeModal();
  });

  test('Navigates to groups, creates groups, adds user', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const group1 = testData.organizations.groups.newGroupName;
    const group2 = testData.organizations.groups.newGroupName2;

    await page.locator('[data-cy="nav-groups"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/groups');

    const group = new GroupAction(page);
    await group.doAddGroup(group1, group2, page);
    await page.waitForLoadState('networkidle');
    await group.doAddMemberToGroup(testData.organizations.users.email, group1, page);
  });

  test('Navigates to projects and creates a new one', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.locator('[data-cy="nav-org-projects"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/projects');

    const project = new ProjectsActions(page);
    await project.doAddProject(testData.organizations.project, page);
  });

  test('Navigates to notifications and creates a couple', async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.waitForLoadState('networkidle');
    await page.locator('[data-cy="nav-notifications"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/notifications');

    const { slack: slackData, email: emailData, webhook: webhookData } = testData.organizations.notifications;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('slack', slackData, page);
    await notifications.doAddNotification('email', emailData, page);
    await notifications.doAddNotification('webhook', webhookData, page);
  });

  test('Navigates to a project, links a group and notifications', async ({ page }) => {
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/projects/${testData.organizations.project.projectName}`);

    await page.locator('[data-cy="link-group"]').click();
    await page.locator('[data-cy="group-select"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'cypress-group1' })
      .click();
    await page.locator('[data-cy="modal-confirm"]').click();

    await page.locator('[data-cy="link-notification"]').click();
    await page.locator('[data-cy="notification-select"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'cy-slack-notification' })
      .click();
    await page.locator('[data-cy="modal-confirm"]').click();
  });

  test.afterAll(async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.locator('[data-cy="nav-groups"]').click();

    const group = new GroupAction(page);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName, page);
    await waitForGraphQL(page, 'removeGroupFromOrganization', true);
    await group.doDeleteGroup(testData.organizations.groups.newGroupName2, page);
    await waitForGraphQL(page, 'removeGroupFromOrganization', true);

    await page.locator('[data-cy="nav-org-projects"]').click();
    const project = new ProjectsActions(page);
    await project.doDeleteProject(testData.organizations.project.projectName, page);

    await page.locator('[data-cy="nav-notifications"]').click();
    const {
      webhook: { name: webhooknName },
      email: { name: emailName },
      slack: { name: slackName },
    } = testData.organizations.notifications;

    const notifications = new NotificationsAction(page);
    await notifications.doDeleteNotification(webhooknName, page);
    await waitForGraphQL(page, 'removeNotification', true);
    await page.waitForTimeout(1000);
    await notifications.doDeleteNotification(emailName, page);
    await waitForGraphQL(page, 'removeNotification', true);
    await page.waitForTimeout(1000);
    await notifications.doDeleteNotification(slackName, page);
  });
});

