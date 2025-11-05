import { Page, expect } from '@playwright/test';
import UsersRepository from '../../repositories/organizations/UsersRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class UsersActions {
  private userRepo: UsersRepository;

  constructor(page: Page) {
    this.userRepo = new UsersRepository(page);
  }

  async doAddUser(email: string, page: Page): Promise<void> {
    await this.userRepo.getAddUserBtn().click();
    await this.userRepo.getAddUserEmail().fill(email);

    await this.userRepo.addUserToGroup();
    await this.userRepo.addUserRole();

    await this.userRepo.getConfirmBtn().click();
    await waitForGraphQL(page, 'addUserToGroup', true);

    await expect(this.userRepo.getRows().filter({ hasText: email })).toBeVisible();
  }

  async doDeleteUser(email: string): Promise<void> {
    await this.userRepo.getDeleteBtnByEmail(email).click();
    await this.userRepo.getConfirmBtn().click();
  }
}

