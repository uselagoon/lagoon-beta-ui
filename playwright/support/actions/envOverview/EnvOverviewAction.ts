import { Page, expect } from '@playwright/test';
import EnvOverviewRepository from '../../repositories/envOverview/EnvOverviewRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

export default class EnvOverviewAction {
  private environment: EnvOverviewRepository;

  constructor(page: Page) {
    this.environment = new EnvOverviewRepository(page);
  }

  async doEnvTypeCheck(): Promise<void> {
    await expect(this.environment.getEnvType()).toHaveText('production');
  }

  async doDeployTypeCheck(): Promise<void> {
    await expect(this.environment.getDeployType()).toHaveText('branch');
  }

  async doSourceCheck(): Promise<void> {
    const source = this.environment.getSource();
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toHaveAttribute('href', 'https://example.com/git/lagoon-demo/tree/main');
  }

  async doRoutesCheck(): Promise<void> {
    const routes = this.environment.getRoutes();
    const count = await routes.count();

    for (let index = 0; index < count; index++) {
      const route = routes.nth(index);
      const link = route.locator('a');
      const href = await link.getAttribute('href');
      const expectedHref = index === 0 ? 'https://lagoondemo.example.org' : 'https://nginx.main.lagoon-demo.ui-kubernetes.lagoon.sh';
      expect(href).toBe(expectedHref);
    }
  }

  async doDeleteEnvironment(branch: string, page: Page): Promise<void> {
    await this.environment.getDeleteButton().click();
    await this.environment.getConfirmInput().fill(branch);
    await this.environment.getDeleteButtonConfirm().click();

    await waitForGraphQL(page, 'deleteEnvironment', true);
    await expect(page).toHaveURL(/.*\/projects\/lagoon-demo/);
  }

  async doDeleteEnvironmentError(branch: string, page: Page): Promise<void> {
    await this.environment.getDeleteButton().click();
    await this.environment.getConfirmInput().fill(branch);
    await this.environment.getDeleteButtonConfirm().click();

    const errorMessage = `Unauthorized: You don\'t have permission to "delete:${
      branch === 'main' ? 'production' : 'development'
    }" on "environment"`;

    const responseBody = await waitForGraphQL(page, 'deleteEnvironment', true);
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);

    await expect(this.environment.getNotification()).toBeVisible();
    await expect(this.environment.getNotification()).toContainText(errorMessage);
  }
}

