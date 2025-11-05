import { Page, expect } from '@playwright/test';
import DeploymentRepository from '../../repositories/deployment/DeploymentRepository';
import DeploymentsAction from '../deployments/DeploymentsAction';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class deploymentAction {
  private deployment: DeploymentRepository;
  private deployments: DeploymentsAction;

  constructor(page: Page) {
    this.deployment = new DeploymentRepository(page);
    this.deployments = new DeploymentsAction(page);
  }

  async doCancelDeployment(page: Page): Promise<void> {
    await this.deployment.getCancelDeploymentBtn().first().click();
    await this.deployment.getConfirmCancelBtn().click();
    await waitForGraphQL(page, 'cancelDeployment', true);

    await expect(this.deployment.getDeploymentRow().first()).toContainText('Cancelled');
  }

  async doFailedCancelDeployment(page: Page): Promise<void> {
    await this.deployment.getCancelDeploymentBtn().first().click();
    await this.deployment.getConfirmCancelBtn().click();

    await waitForGraphQL(page, 'cancelDeployment', true);

    const errorMessage = `Unauthorized: You don't have permission to "cancel" on "deployment"`;
    await expect(this.deployment.getNotification()).toBeVisible();
    await expect(this.deployment.getNotification()).toContainText(errorMessage);
  }

  async doToggleLogViewer(): Promise<void> {
    await this.deployment.getToggler().click();

    const logViewer = this.deployment.getLogViewer();
    await expect(logViewer).toBeVisible();

    const content = await logViewer.textContent();
    expect(content).toBeTruthy();
    await this.deployment.getToggler().click();

    const processedLogs = logViewer.locator('.processed-logs');
    await expect(processedLogs).toBeVisible();
  }

  async doLogViewerCheck(): Promise<void> {
    const accordionHeadings = this.deployment.getAccordionHeadings();
    const count = await accordionHeadings.count();

    if (count > 0) {
      for (let i = 0; i < count - 1; i++) {
        await accordionHeadings.nth(i).click();
      }

      for (let i = 0; i < count - 1; i++) {
        const sectionDetails = accordionHeadings
          .nth(i)
          .locator('xpath=following-sibling::*[2]')
          .locator('[data-cy="section-details"]');

        const logText = sectionDetails.locator('.log-text');
        const logViewer = sectionDetails.locator('.log-viewer');

        const logTextCount = await logText.count();
        if (logTextCount > 0) {
          await expect(logText).toBeVisible();
        } else {
          const logViewerText = await logViewer.textContent();
          expect(logViewerText).toBeTruthy();
        }
      }
    } else {
      const logViewer = this.deployment.getLogViewer();
      const logViewerText = await logViewer.textContent();
      expect(logViewerText).toBeTruthy();
    }
  }

  async navigateToRunningDeployment(page: Page): Promise<void> {
    await this.deployments.doChangeNumberOfResults('All', page);

    await page
      .locator('[data-cy="deployment-row"]')
      .locator('span.ant-tag')
      .filter({ hasText: 'Running' })
      .first()
      .locator('xpath=ancestor::*[@data-cy="deployment-row"]')
      .locator('a')
      .first()
      .click();
  }
}

