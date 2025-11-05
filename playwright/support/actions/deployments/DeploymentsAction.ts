import { Page, expect } from '@playwright/test';
import DeploymentsRepository from '../../repositories/deployments/DeploymentsRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class DeploymentsAction {
  private deployments: DeploymentsRepository;

  constructor(page: Page) {
    this.deployments = new DeploymentsRepository(page);
  }

  async doCancelDeployment(page: Page): Promise<void> {
    await this.deployments.getCancelBtn().first().click();
    await this.deployments.getConfirmCancelBtn().click();
    await waitForGraphQL(page, 'cancelDeployment', true);

    await expect(this.deployments.getDeployments().first()).toContainText('Cancelled');
  }

  async doFailedCancelDeployment(page: Page): Promise<void> {
    await this.deployments.getCancelBtn().first().click();
    await this.deployments.getConfirmCancelBtn().click();

    await waitForGraphQL(page, 'cancelDeployment', true);

    await expect(this.deployments.getNotification()).toBeVisible();
    await expect(this.deployments.getNotification()).toContainText('There was a problem cancelling deployment.');
  }

  async doDeployment(page: Page): Promise<void> {
    await this.deployments.getDeployBtn().click();
    await waitForGraphQL(page, 'deployEnvironmentLatest', true);

    await this.deployments.getDeploymentTriggered();
  }

  async doFailedDeployment(page: Page): Promise<void> {
    await this.deployments.getDeployBtn().click();

    await waitForGraphQL(page, 'deployEnvironmentLatest', true);

    const notificationText = await this.deployments.getNotification().textContent();
    const errorMessage = /Deployment failedUnauthorized: You don't have permission to "deploy:.*" on "environment"/;
    expect(notificationText).toMatch(errorMessage);
  }

  async doChangeNumberOfResults(val: string | number, page: Page): Promise<void> {
    await this.deployments.getResultSelector().click();
    await this.deployments
      .getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: String(val) })
      .click();

    const expectedLimit = val !== 'All' ? `?results=${val}` : '?results=-1';
    await expect(page).toHaveURL(new RegExp(`.*${expectedLimit.replace('?', '\\?')}`));
  }
}

