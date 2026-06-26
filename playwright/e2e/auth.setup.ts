import { test as setup } from '@playwright/test';
import { existsSync, statSync } from 'fs';
import path from 'path';
import { env } from '../support/test-helpers';

const authDir = path.join(__dirname, '../.auth');

const MAX_AGE_MS = 8 * 60 * 60 * 1000;

function authFileValid(filePath: string): boolean {
  if (!existsSync(filePath)) return false;
  return Date.now() - statSync(filePath).mtimeMs < MAX_AGE_MS;
}

async function authenticate(page: import('@playwright/test').Page, username: string, authFile: string): Promise<void> {
  if (authFileValid(authFile)) return;

  const password = username;
  await page.goto(env.url);

  await page.fill('#username', username);
  await page.click('#kc-login', { timeout: 60000 });

  await page.waitForSelector('#password');
  await page.fill('#password', password);
  await page.click('#kc-login', { timeout: 60000 });
  await page.waitForURL(/\/projects/, { waitUntil: 'load', timeout: 60000 });

  const sessionResponse = await page.request.get(`${env.url}/api/auth/session`);
  const sessionBody = await sessionResponse.json();
  if (sessionBody?.error) {
    throw new Error(`Login failed for ${username}: session error`);
  }

  await page.context().storageState({ path: authFile });
}

setup('authenticate as owner', async ({ page }) => {
  await authenticate(page, env.user_owner, path.join(authDir, 'owner.json'));
});

setup('authenticate as guest', async ({ page }) => {
  await authenticate(page, env.user_guest, path.join(authDir, 'guest.json'));
});

setup('authenticate as reporter', async ({ page }) => {
  await authenticate(page, env.user_reporter, path.join(authDir, 'reporter.json'));
});

setup('authenticate as developer', async ({ page }) => {
  await authenticate(page, env.user_developer, path.join(authDir, 'developer.json'));
});

setup('authenticate as maintainer', async ({ page }) => {
  await authenticate(page, env.user_maintainer, path.join(authDir, 'maintainer.json'));
});

setup('authenticate as orguser', async ({ page }) => {
  await authenticate(page, env.user_orguser, path.join(authDir, 'orguser.json'));
});

setup('authenticate as orgviewer', async ({ page }) => {
  await authenticate(page, env.user_orgviewer, path.join(authDir, 'orgviewer.json'));
});

setup('authenticate as orgadmin', async ({ page }) => {
  await authenticate(page, env.user_orgadmin, path.join(authDir, 'orgadmin.json'));
});

setup('authenticate as orgowner', async ({ page }) => {
  await authenticate(page, env.user_orgowner, path.join(authDir, 'orgowner.json'));
});

setup('authenticate as platformowner', async ({ page }) => {
  await authenticate(page, env.user_platformowner, path.join(authDir, 'platformowner.json'));
});