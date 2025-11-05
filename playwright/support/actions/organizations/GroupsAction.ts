import { Page, expect } from '@playwright/test';
import GroupsRepository from '../../repositories/organizations/GroupsRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class GroupAction {
  private groupRepo: GroupsRepository;

  constructor(page: Page) {
    this.groupRepo = new GroupsRepository(page);
  }

  async doAddGroup(newGroup1: string, newGroup2: string, page: Page): Promise<void> {
    await this.groupRepo.getAddGroupBtn().click();
    await this.groupRepo.getGroupNameInput().fill(newGroup1);
    await this.groupRepo.getModalConfirmBtn().click();
    await Promise.all([
      waitForGraphQL(page, 'addGroupToOrganization', true),
      waitForGraphQL(page, 'getOrganization', false),
    ]);

    await expect(this.groupRepo.getGroupRows().filter({ hasText: newGroup1 })).toBeVisible();

    await page.reload();

    await this.groupRepo.getAddGroupBtn().click();
    await this.groupRepo.getGroupNameInput().fill(newGroup2);
    await this.groupRepo.getModalConfirmBtn().click();

    await Promise.all([
      waitForGraphQL(page, 'addGroupToOrganization', true),
      waitForGraphQL(page, 'getOrganization', false),
    ]);

    await expect(this.groupRepo.getGroupRows().filter({ hasText: newGroup2 })).toBeVisible();
  }

  async doFailedAddGroup(newGroup1: string, page: Page): Promise<void> {
    await this.groupRepo.getAddGroupBtn().click();
    await this.groupRepo.getGroupNameInput().fill(newGroup1);
    await this.groupRepo.getModalConfirmBtn().click();
    const responseBody = await waitForGraphQL(page, 'addGroupToOrganization', true);

    expect(responseBody).toHaveProperty('errors');
    const errorMessage = `Unauthorized: You don't have permission to "addGroup" on "organization"`;
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doGroupSearch(group1: string, group2: string): Promise<void> {
    await this.groupRepo.getSearchBar().fill(group1);
    await expect(this.groupRepo.getGroupRows().filter({ hasText: group1 })).toBeVisible();

    await this.groupRepo.getSearchBar().fill('does not exist');
    await expect(this.groupRepo.getEmpty()).toBeVisible();

    await this.groupRepo.getSearchBar().fill(group2);
    await expect(this.groupRepo.getGroupRows().filter({ hasText: group2 })).toBeVisible();
  }

  async doAddMemberToGroup(userEmail: string, groupToAddTo: string, page: Page): Promise<void> {
    await this.groupRepo.getAddUserBtn(groupToAddTo).click();
    await this.groupRepo.getUserNameInput().fill(userEmail);

    await this.groupRepo.getResultSelector().click();
    await this.groupRepo
      .getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'Maintainer' })
      .click();

    await this.groupRepo.getModalConfirmBtn().click();
    await Promise.all([
      waitForGraphQL(page, 'addUserToGroup', true),
      waitForGraphQL(page, 'getOrganization', false),
    ]);

    await page.waitForLoadState('networkidle');

    const memberCountText = await this.groupRepo
      .getContainingRow(groupToAddTo)
      .locator('xpath=ancestor::*[@data-cy="group-row"]')
      .locator('[data-cy=member-count]')
      .textContent();

    if (memberCountText) {
      const trimmedText = memberCountText.trim();
      expect(trimmedText).toBe('Active Members: 1');
    }
  }

  async doDeleteGroup(groupName: string, page: Page): Promise<void> {
    await this.groupRepo.getDeleteGroupBtn().first().click();
    await this.groupRepo.getModalConfirmBtn().click();
    await waitForGraphQL(page, 'removeGroupFromOrganization', true);

    const totalLabel = this.groupRepo.getTotalLabel();
    const totalLabelText = await totalLabel.textContent();

    if (totalLabelText && totalLabelText.includes('0')) {
      await expect(this.groupRepo.getEmpty()).toBeVisible();
    } else {
      await expect(this.groupRepo.getGroupRows().filter({ hasText: groupName })).not.toBeVisible();
    }
  }
}

