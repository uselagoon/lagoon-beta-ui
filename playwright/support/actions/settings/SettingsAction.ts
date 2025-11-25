import { Page, expect } from '@playwright/test';
import SettingsRepository from '../../repositories/settings/SettingsRepository';

export default class SettingAction {
  private settings: SettingsRepository;

  constructor(page: Page) {
    this.settings = new SettingsRepository(page);
  }

  async doEmptySshCheck(page: Page): Promise<void> {
    await expect(page.locator('[data-cy="empty"]')).toBeVisible();
  }

  async addSshKey(name: string, value: string): Promise<void> {
    await this.settings.getAddNewKeyButton().click();
    await this.settings.getNameInput().fill(name);
    await this.settings.getValueInput().fill(value);
    await expect(this.settings.getSubmitBtn()).toBeEnabled();
    await this.settings.getSubmitBtn().click();

    await expect(page.locator(`text=${name}`)).toBeVisible();
  }

  async deleteSshKey(name: string): Promise<void> {
    await this.settings.getDeleteBtn(name).click();

    await this.settings.getDeleteConfirmInput().fill(name);
    await this.settings.getSubmitBtn().click();

    await expect(page.locator(`text=${name}`)).not.toBeVisible();
  }
}

