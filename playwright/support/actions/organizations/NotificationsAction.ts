import { Page, expect } from '@playwright/test';
import { testData } from '../../../fixtures/variables';
import NotificationsRepository from '../../repositories/organizations/NotificationsRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

const notifMap = {
  slack: ['name', 'webhook', 'channel'],
  rocketChat: ['name', 'webhook', 'channel'],
  email: ['name', 'email'],
  teams: ['name', 'webhook'],
  webhook: ['name', 'webhook'],
};

type NotificationData = {
  name: string;
  webhook?: string;
  channel?: string;
  email?: string;
};

const getMutationName = (notification: keyof typeof notifMap) => {
  const mutations = {
    slack: 'Slack',
    rocketChat: 'RocketChat',
    email: 'Email',
    teams: 'MicrosoftTeams',
    webhook: 'Webhook',
  } as const;

  return mutations[notification];
};

export default class NotificationsAction {
  private notificationRepo: NotificationsRepository;

  constructor(page: Page) {
    this.notificationRepo = new NotificationsRepository(page);
  }

  async doAddNotification(
    notifType: keyof typeof notifMap,
    notificationData: NotificationData,
    page: Page
  ): Promise<void> {
    const fieldsToFill = notifMap[notifType];

    await this.notificationRepo.getAddNotification().click();
    await this.notificationRepo.getNotificationSelect().click();
    await this.notificationRepo.getNotificationSelectOption(notifType).click();

    for (const field of fieldsToFill) {
      await page.locator(`[data-cy="notification-${field}"]`).fill(notificationData[field as keyof NotificationData] || '');
    }

    await page.locator('[data-cy="modal-confirm"]').click();

    await waitForGraphQL(page, `addNotification${getMutationName(notifType)}`, true);
    await expect(page.locator('[data-cy="notification-row"]').filter({ hasText: notificationData.name })).toBeVisible();
  }

  async doFailedAddNotification(
    notifType: keyof typeof notifMap,
    notificationData: NotificationData,
    page: Page
  ): Promise<void> {
    const fieldsToFill = notifMap[notifType];

    await this.notificationRepo.getAddNotification().click();
    await this.notificationRepo.getNotificationSelect().click();
    await this.notificationRepo.getNotificationSelectOption(notifType).click();

    for (const field of fieldsToFill) {
      await page.locator(`[data-cy="notification-${field}"]`).fill(notificationData[field as keyof NotificationData] || '');
    }

    await page.locator('[data-cy="modal-confirm"]').click();

    const responseBody = await waitForGraphQL(page, `addNotification${getMutationName(notifType)}`, true);
    const errorMessage = `Unauthorized: You don't have permission to "addNotification" on "organization"`;
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doEditNotification(page: Page): Promise<void> {
    const {
      slack: { name: slackName },
    } = testData.organizations.notifications;

    await this.notificationRepo.getEditBtn(slackName).click();
    await page.locator('[data-cy="notification-name"]').first().fill(`${slackName}-edited`);
    await page.locator('[data-cy="notification-webhook"]').first().fill(`${slackName}-edited`);
    await this.notificationRepo.getModalConfirm().click();

    await waitForGraphQL(page, 'UpdateNotificationSlack', true);
    await expect(page.locator('[data-cy="notification-row"]').filter({ hasText: `${slackName}-edited` })).toBeVisible();
  }

  async doDeleteNotification(notification: string, page: Page): Promise<void> {
    await this.notificationRepo.getNotificationDelete(notification).click();
    await this.notificationRepo.getModalConfirm().click();
    await expect(page.locator('[data-cy="notification-row"]').filter({ hasText: notification })).not.toBeVisible();
  }

  async closeModal(page: Page): Promise<void> {
    await page.locator('[data-cy="modal-cancel"]').click();
  }
}

