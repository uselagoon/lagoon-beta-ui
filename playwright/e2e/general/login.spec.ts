import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Login flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('user can log in with valid Keycloak credentials', async ({ page }) => {
    await page.goto(env.url);
    await page.fill('#username', env.user_owner);
    await page.click('#kc-login');
    await page.waitForSelector('#password', { state: 'visible' });
    await page.fill('#password', env.user_owner);
    await page.click('#kc-login');
    await page.waitForURL(/\/projects/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/projects/);
  });
});

test.describe('Authenticated user UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects`);
  });

  test('logged-in user sees their email displayed in the sidebar', async ({ page }) => {
    const userLabel = page.getByTestId('user-name');
    await expect(userLabel).toBeVisible();
    await expect(userLabel).toContainText('@example.com');
  });

  test('user can switch theme (light/dark) and preference persists on reload', async ({ page }) => {
    const themeToggle = page.getByTestId('theme-toggle');
    await expect(themeToggle).toBeVisible();

    const before = await page.evaluate(() => localStorage.getItem('theme'));
    const expectedAfter = before === 'dark' ? 'light' : 'dark';

    await themeToggle.click();

    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe(expectedAfter);
    await expect(page.locator('html')).toHaveClass(new RegExp(expectedAfter));

    await page.reload({ waitUntil: 'load' });
    await expect(page.locator('html')).toHaveClass(new RegExp(expectedAfter));

    await page.getByTestId('theme-toggle').click();
    await expect.poll(() => page.evaluate(() => localStorage.getItem('theme'))).toBe(before ?? 'light');
  });
});

test.describe('Logout flow', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('logged-out user is redirected to Keycloak when accessing /projects', async ({ page }) => {
    await page.goto(env.url);
    await page.fill('#username', env.user_owner);
    await page.click('#kc-login', { timeout: 60000 });
    await page.waitForSelector('#password', { state: 'visible' });
    await page.fill('#password', env.user_owner);
    await page.click('#kc-login', { timeout: 60000 });
    await page.waitForURL(/\/projects/, { waitUntil: 'load' });

    await page.getByTestId('user-menu-trigger').click();
    const signOut = page.getByTestId('sign-out');
    await expect(signOut).toBeVisible();
    await signOut.click();
    await page.waitForURL(/\/realms\/lagoon\/protocol\/openid-connect\/auth/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/realms\/lagoon\/protocol\/openid-connect\/auth/);

    await page.goto(`${env.url}/projects`);
    await page.waitForURL(/\/realms\/lagoon\/protocol\/openid-connect\/auth/, { waitUntil: 'load' });
    await expect(page).toHaveURL(/\/realms\/lagoon\/protocol\/openid-connect\/auth/);
  });
});