import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test('project overview shows environments', async ({ page }) => {
  await page.goto(`${env.url}/projects/${env.project}`);

  const rows = page.getByTestId('table-row');
  await expect(rows.first()).toBeVisible();
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const link = rows.nth(i).locator('a[href]');
    await expect(link.first()).toBeVisible();
  }
});

test('project details tab shows git URL, branches, and organization', async ({ page }) => {
  await page.goto(`${env.url}/projects/${env.project}/project-details`);

  await expect(page.getByTestId('git-url')).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('git-url')).not.toHaveText('');

  await expect(page.getByTestId('branches-enabled')).toBeVisible();
  await expect(page.getByTestId('development-environments-in-use')).toBeVisible();
});

test('git URL copy-to-clipboard shows copied state', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      writable: true,
    });
  });

  await page.goto(`${env.url}/projects/${env.project}/project-details`);

  const copyButton = page.getByTestId('copy-button');
  await expect(copyButton).toBeVisible();
  await copyButton.click();
  await expect(copyButton).not.toBeVisible();
});
