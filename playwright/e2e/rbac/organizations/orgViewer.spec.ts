import { test, expect } from '@playwright/test';
import { testData } from '../../../fixtures/variables';
import GroupAction from '../../../support/actions/organizations/GroupsAction';
import NotificationsAction from '../../../support/actions/organizations/NotificationsAction';
import OverviewAction from '../../../support/actions/organizations/OverviewAction';
import ProjectsActions from '../../../support/actions/organizations/ProjectsActions';
import { env, loginUser, setupGraphQLInterception, waitForGraphQL } from '../../../support/test-helpers';

test.describe('Organizations ORGVIEWER journey', () => {
  test.beforeEach(async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await loginUser(page, env.user_orgviewer);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization`);
  });

  test('Fails to change org name and desc - no permission for ORGVIEWER', async ({ page }) => {
    const overview = new OverviewAction(page);
    await overview.doFailedChangeOrgFriendlyname(testData.organizations.overview.friendlyName, page);
    await overview.closeModal();
    await overview.doFailedChangeOrgDescription(testData.organizations.overview.description, page);
    await overview.closeModal();
  });

  test('Navigates to groups and fails to create a one - no permission for ORGVIEWER', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await page.locator('[data-cy="nav-groups"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/groups');

    const group = new GroupAction(page);
    await group.doFailedAddGroup(testData.organizations.groups.newGroupName + '-viewer', page);
    await page.locator('[data-cy="modal-cancel"]').click();
    await group.doFailedAddGroup(testData.organizations.groups.newGroupName2, page);
  });

  test('Navigates to projects and fails to create a new one - no permission for ORGVIEWER', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.locator('[data-cy="nav-org-projects"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/projects');

    const project = new ProjectsActions(page);
    await project.doFailedaddProject(testData.organizations.project, page);
  });

  test('Navigates to notifications and fails to create any - no permission for ORVIEWER', async ({ page }) => {
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
    await page.waitForLoadState('networkidle');
    await page.locator('[data-cy="nav-notifications"]').click();
    await expect(page).toHaveURL('/organizations/lagoon-demo-organization/notifications');

    const { slack: slackData, email: emailData, webhook: webhookData } = testData.organizations.notifications;
    const notifications = new NotificationsAction(page);
    await notifications.doFailedAddNotification('slack', slackData, page);
    await notifications.closeModal();
    await notifications.doFailedAddNotification('email', emailData, page);
    await notifications.closeModal();
    await notifications.doFailedAddNotification('webhook', webhookData, page);
    await notifications.closeModal();
  });

  test('Navigates to a project, fails to link a notification - no permission for ORGVIEWER', async ({ page }) => {
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/projects/lagoon-demo-org`);

    await page.locator('[data-cy="link-notification"]').click();
    await page.locator('[data-cy="notification-select"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'slack-test' })
      .click();
    await page.locator('[data-cy="modal-confirm"]').click();

    const responseBody = await waitForGraphQL(page, 'addNotificationToProject', true);
    expect(responseBody).toHaveProperty('errors');
    const errorMessage = `Unauthorized: You don't have permission to "addNotification" on "organization"`;
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  });
});

