import type { Page, Locator } from '@playwright/test';

export const getBySel = (page: Page, selector: string): Locator =>
  page.getByTestId(selector);

export const nav = {
  toProjects:      (page: Page) => page.goto('/projects'),
  toOrganizations: (page: Page) => page.goto('/organizations'),
  toSettings:      (page: Page) => page.goto('/settings'),
  toProject:       (page: Page, name: string) => page.goto(`/projects/${name}`),
  toOrganization:  (page: Page, name: string) => page.goto(`/organizations/${name}`),
  toEnvironment:   (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}`),
  toDeployments:   (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}/deployments`),
  toTasks:         (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}/tasks`),
  toBackups:       (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}/backups`),
  toEnvVariables:  (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}/environment-variables`),
  toVariables:     (page: Page, project: string, env: string) =>
    page.goto(`/projects/${project}/${env}/environment-variables`),
};

export async function validateSession(page: Page): Promise<Record<string, unknown>> {
  const response = await page.request.get('/api/auth/session');
  if (!response.ok()) {
    throw new Error(`Session endpoint returned ${response.status()}`);
  }
  const body = await response.json();
  if (body.error) {
    throw new Error(`Session error: ${body.error}`);
  }
  return body;
}

export const waitForToast = (page: Page, text?: string | RegExp) => {
  const toastLocator = page.locator('[data-sonner-toast]');
  if (text) {
    return toastLocator.filter({ hasText: text }).first().waitFor({ state: 'visible' });
  }
  return toastLocator.first().waitFor({ state: 'visible' });
};

export const confirmModal = (page: Page) =>
  page.getByTestId('modal-confirm').click();

export const cancelModal = (page: Page) =>
  page.getByTestId('modal-cancel').click();

export async function confirmDelete(page: Page, confirmText: string) {
  await page.getByTestId('delete-confirm').fill(confirmText);
  await confirmModal(page);
}
