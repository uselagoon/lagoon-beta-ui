import { test, expect } from '@playwright/test';
import { env, loginUser } from '../../support/test-helpers';
import NavigationRepository from '../../support/repositories/navigation/NavigationRepository';

test.describe('Initial login and theme spec', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page, env.user_owner);
    await page.goto(env.url);
  });

  test('Logins and gets redirected to /projects', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/projects/);
  });

  test('Checks displayed logged in user', async ({ page }) => {
    const navRepo = new NavigationRepository(page);
    await expect(navRepo.getLinkElement('user-name')).toContainText(env.user_owner);
  });

  test('Switches themes', async ({ page }) => {
    const themeIcon = page.locator('[data-cy="theme-icon"]');
    const currentTheme = await page.evaluate(() => localStorage.getItem('theme'));

    if (currentTheme === 'dark') {
      await themeIcon.click();
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(theme).toBe('light');
      // revert to dark
      await themeIcon.click();
    } else {
      await themeIcon.click();
      const theme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(theme).toBe('dark');
    }
  });

  test('Logs out', async ({ page, context }) => {
    const navRepo = new NavigationRepository(page);
    await navRepo.getLinkElement('user-name').hover();
    await navRepo.getLinkElement('sign-out').click();
    await page.waitForTimeout(1000);
    const newPage = await context.waitForEvent('page');
    await expect(newPage.locator('text=Sign in to your account')).toBeVisible();
  });
});

