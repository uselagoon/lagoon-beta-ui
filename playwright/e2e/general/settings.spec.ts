import { test } from '@playwright/test';
import { testData } from '../../fixtures/variables';
import SettingAction from '../../support/actions/settings/SettingsAction';
import { env, loginUser } from '../../support/test-helpers';

test.describe('Settings page', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
  });

  test('Checks initial SSH keys', async ({ page }) => {
    await page.goto(`${env.url}/settings`);
    const settings = new SettingAction(page);
    await settings.doEmptySshCheck(page);
  });

  test('Adds SSH key', async ({ page }) => {
    await page.goto(`${env.url}/settings`);
    const settings = new SettingAction(page);
    await settings.addSshKey(testData.ssh.name, testData.ssh.value);
  });

  test('Deletes SSH key', async ({ page }) => {
    await page.goto(`${env.url}/settings`);
    const settings = new SettingAction(page);
    await settings.deleteSshKey(testData.ssh.name);
    await settings.doEmptySshCheck(page);
  });
});

