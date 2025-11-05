import { Page } from '@playwright/test';
import VariablesRepository from '../../repositories/variables/VariablesRepository';

export default class VariablesAction {
  private environment: VariablesRepository;

  constructor(page: Page) {
    this.environment = new VariablesRepository(page);
  }

  async doEnvNavigation(): Promise<void> {
    await this.environment.getVariablesLink().click();
  }

  async doHideShowToggle(): Promise<void> {
    await this.environment.getToggleShowButton().click();
  }

  async doValueToggle(): Promise<void> {
    const rows = this.environment.getEnvDataRows();
    const count = await rows.count();
    for (let i = 0; i < count; i++) {
      await rows.nth(i).locator('[data-cy="toggle"]').click();
    }
  }

  async doAddVariable(name: string, value: string, page: Page): Promise<void> {
    await this.environment.getAddButton().first().click();
    await page.locator('[data-cy="var-name"]').fill(name);

    await page.locator('[data-cy="select-scope"]').click();
    await page
      .locator('[data-cy="select-menu"]')
      .locator('.ant-select-item-option-content')
      .filter({ hasText: 'Runtime' })
      .click();

    await page.locator('[data-cy="var-value"]').fill(value);
    await page.locator('[data-cy="modal-confirm"]').click();
  }

  async doDeleteVariable(name: string, page: Page): Promise<void> {
    await this.environment.getDeleteBtn(name).click();
    await page.locator('[data-cy="delete-confirm"]').fill(name);
    await page.locator('[data-cy="modal-confirm"]').click();
  }
}

