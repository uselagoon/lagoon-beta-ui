import { Page, expect } from '@playwright/test';
import ManageRepository from '../../repositories/organizations/ManageRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class ManageAction {
  private manageRepo: ManageRepository;

  constructor(page: Page) {
    this.manageRepo = new ManageRepository(page);
  }

  async doAddOrgViewer(viewerUser: string, page: Page): Promise<void> {
    await this.manageRepo.getAddUserBtn().click();
    await this.manageRepo.getUserEmailField().fill(viewerUser);
    await this.manageRepo.getUserRoleDropdown().click();
    await this.manageRepo.getUserViewerRoleOption().click();
    await this.manageRepo.getConfirmBtn().click();

    await waitForGraphQL(page, 'AddUserToOrganization', true);
    const userRowsText = await this.manageRepo.getUserRows().textContent();
    expect(userRowsText).toContain(viewerUser);
  }

  async doEditOrgViewerToAdmin(user: string, page: Page): Promise<void> {
    await this.manageRepo.getUserByRow(user).locator('[data-cy="update-user"]').click();
    await this.manageRepo.getUserRoleDropdown().click();
    await this.manageRepo.getUserAdminRoleOption().click();
    await this.manageRepo.getConfirmBtn().click();

    await waitForGraphQL(page, 'AddUserToOrganization', true);
    await expect(this.manageRepo.getUserByRow(user).locator('div').filter({ hasText: 'admin' })).toBeVisible();
  }

  async doEditOrgViewerToOwner(user: string, page: Page): Promise<void> {
    await this.manageRepo.getUserByRow(user).locator('[data-cy="update-user"]').click();
    await this.manageRepo.getUserRoleDropdown().click();
    await this.manageRepo.getUserOwnerRoleOption().click();
    await this.manageRepo.getConfirmBtn().click();

    await waitForGraphQL(page, 'AddUserToOrganization', true);
    await expect(this.manageRepo.getUserByRow(user).locator('div').filter({ hasText: 'owner' })).toBeVisible();
  }

  async doDeleteUser(user: string): Promise<void> {
    await this.manageRepo.getUserToDelete(user).click();
    await this.manageRepo.getConfirmBtn().click();
  }
}

