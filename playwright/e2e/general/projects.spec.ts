import { test, expect } from '@playwright/test';
import { env } from '../../support/test-helpers';

test.describe('Projects page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${env.url}/projects`);
  });

  test('Projects list renders with data', async ({ page }) => {
    const rows = page.getByTestId('table-row');
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test('Search filters projects by name', async ({ page }) => {
    await page.getByTestId('search-input').fill(env.project);
    const rows = page.getByTestId('table-row');
    await expect(rows.first()).toBeVisible();
    await expect(rows.filter({ hasText: env.project }).first()).toBeVisible();
  });

  test('Search with no results shows empty state', async ({ page }) => {
    await page.getByTestId('search-input').fill('zzz-no-match-xyz');
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('Pagination updates URL params', async ({ page }) => {
    await page.getByTestId('results-per-page').click();
    await page.getByRole('option', { name: '20 results per page' }).click();
    await page.waitForURL(/results=20/);
    expect(page.url()).toContain('results=20');
  });
});
