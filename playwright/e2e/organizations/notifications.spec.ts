import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import NotificationsAction from '../../support/actions/organizations/NotificationsAction';
import { env, loginUser, setupGraphQLInterception } from '../../support/test-helpers';

test.describe('Org Notifications page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_platformowner);
    await page.goto(`${env.url}/organizations/lagoon-demo-organization/notifications`);
    await page.waitForLoadState('networkidle');
    const interceptor = setupGraphQLInterception(page);
    interceptor.start();
  });

  test('Adds Slack notification', async ({ page }) => {
    const slackData = testData.organizations.notifications.slack;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('slack', slackData, page);
  });

  test('Adds Rocketchat notification', async ({ page }) => {
    const rocketData = testData.organizations.notifications.rocketChat;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('rocketChat', rocketData, page);
  });

  test('Adds Teams notification', async ({ page }) => {
    const teamsData = testData.organizations.notifications.teams;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('teams', teamsData, page);
  });

  test('Adds Email notification', async ({ page }) => {
    const emailData = testData.organizations.notifications.email;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('email', emailData, page);
  });

  test('Adds Webhook notification', async ({ page }) => {
    const webhookData = testData.organizations.notifications.webhook;
    const notifications = new NotificationsAction(page);
    await notifications.doAddNotification('webhook', webhookData, page);
  });

  test('Edits notification', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    const notifications = new NotificationsAction(page);
    await notifications.doEditNotification(page);
  });

  test('Deletes notifications', async ({ page }) => {
    const {
      webhook: { name: webhooknName },
      email: { name: emailName },
      teams: { name: teamsName },
      rocketChat: { name: rocketChatName },
      slack: { name: slackName },
    } = testData.organizations.notifications;

    await page.waitForLoadState('networkidle');
    const notifications = new NotificationsAction(page);
    await notifications.doDeleteNotification(webhooknName, page);
    await page.waitForLoadState('networkidle');
    await notifications.doDeleteNotification(emailName, page);
    await page.waitForLoadState('networkidle');
    await notifications.doDeleteNotification(teamsName, page);
    await page.waitForLoadState('networkidle');
    await notifications.doDeleteNotification(rocketChatName, page);
    await page.waitForLoadState('networkidle');
    await notifications.doDeleteNotification(slackName, page);
  });
});

