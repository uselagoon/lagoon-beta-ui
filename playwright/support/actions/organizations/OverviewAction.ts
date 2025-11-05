import { Page, expect } from '@playwright/test';
import OverviewRepository from '../../repositories/organizations/OverviewRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class OverviewAction {
  private overviewRepo: OverviewRepository;

  constructor(page: Page) {
    this.overviewRepo = new OverviewRepository(page);
  }

  async doNavLinkCheck(url: string, page: Page): Promise<void> {
    await this.overviewRepo.getLinkElement('nav-groups').click();
    await expect(page).toHaveURL(`${url}/organizations/lagoon-demo-organization/groups`);

    await page.goto(`${url}/organizations/lagoon-demo-organization`);
    await this.overviewRepo.getLinkElement('nav-org-projects').click();
    await expect(page).toHaveURL(`${url}/organizations/lagoon-demo-organization/projects`);

    await page.goto(`${url}/organizations/lagoon-demo-organization`);
    await this.overviewRepo.getLinkElement('nav-notifications').click();
    await expect(page).toHaveURL(`${url}/organizations/lagoon-demo-organization/notifications`);

    await page.goto(`${url}/organizations/lagoon-demo-organization`);
    await this.overviewRepo.getLinkElement('nav-manage').click();
    await expect(page).toHaveURL(`${url}/organizations/lagoon-demo-organization/manage`);
  }

  async doQuotaFieldCheck(): Promise<void> {
    await expect(this.overviewRepo.getFieldElement('groups')).toBeVisible();
    await expect(this.overviewRepo.getFieldElement('groups')).not.toBeEmpty();
    await expect(this.overviewRepo.getFieldElement('projects')).toBeVisible();
    await expect(this.overviewRepo.getFieldElement('projects')).not.toBeEmpty();
    await expect(this.overviewRepo.getFieldElement('notifications')).toBeVisible();
    await expect(this.overviewRepo.getFieldElement('notifications')).not.toBeEmpty();
    await expect(this.overviewRepo.getFieldElement('environments')).toBeVisible();
    await expect(this.overviewRepo.getFieldElement('environments')).not.toBeEmpty();
  }

  async changeOrgFriendlyname(friendlyName: string, page: Page): Promise<void> {
    await this.overviewRepo.getNameEditButton('edit-name').click();
    await this.overviewRepo.getEditField().clear();
    await this.overviewRepo.getEditField().fill(friendlyName);
    await this.overviewRepo.getSubmitButton().click();

    await waitForGraphQL(page, 'updateOrganizationFriendlyName', true);
    await page.waitForLoadState('networkidle');

    const friendlyNameText = await this.overviewRepo.getfriendlyName().textContent();
    if (friendlyNameText) {
      const trimmedText = friendlyNameText.trim();
      expect(trimmedText).toBe(friendlyName);
    }
  }

  async doFailedChangeOrgFriendlyname(friendlyName: string, page: Page): Promise<void> {
    await this.overviewRepo.getNameEditButton('edit-name').click();
    await this.overviewRepo.getEditField().clear();
    await this.overviewRepo.getEditField().fill(friendlyName);
    await this.overviewRepo.getSubmitButton().click();

    const responseBody = await waitForGraphQL(page, 'updateOrganizationFriendlyName', true);
    const errorMessage = "Unauthorized: You don't have permission to \"updateOrganization\" on \"organization\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async changeOrgDescription(description: string, page: Page): Promise<void> {
    await this.overviewRepo.getDescEditButton('edit-desc').click();
    await this.overviewRepo.getEditField().clear();
    await this.overviewRepo.getEditField().fill(description);
    await this.overviewRepo.getSubmitButton().click();

    await waitForGraphQL(page, 'updateOrganizationFriendlyName', true);
    await page.waitForLoadState('networkidle');

    const descriptionText = await this.overviewRepo.getDescription().textContent();
    if (descriptionText) {
      const trimmedText = descriptionText.trim();
      expect(trimmedText).toBe(description);
    }
  }

  async doFailedChangeOrgDescription(description: string, page: Page): Promise<void> {
    await this.overviewRepo.getDescEditButton('edit-desc').click();
    await this.overviewRepo.getEditField().clear();
    await this.overviewRepo.getEditField().fill(description);
    await this.overviewRepo.getSubmitButton().click();

    const responseBody = await waitForGraphQL(page, 'updateOrganizationFriendlyName', true);
    const errorMessage = "Unauthorized: You don't have permission to \"updateOrganization\" on \"organization\"";
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async closeModal(): Promise<void> {
    await this.overviewRepo.getCancelButton().click();
  }
}

