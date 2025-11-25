import { Page, expect } from '@playwright/test';
import ProjectRepository from '../../repositories/project/ProjectRepository';

export default class ProjectAction {
  private project: ProjectRepository;

  constructor(page: Page) {
    this.project = new ProjectRepository(page);
  }

  async doNavigateToFirst(page: Page): Promise<void> {
    await page
      .locator('[data-cy="project-row"]')
      .first()
      .locator('xpath=ancestor::*[@data-cy="project-row"]')
      .locator('a')
      .first()
      .click();
  }

  async navToDetails(page: Page): Promise<void> {
    await page.locator('[data-cy="nav-details"]').click();
  }

  async doClipboardCheck(page: Page): Promise<void> {
    await this.project.getCopyButton().click();

    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    const gitUrlText = await this.project.getGitUrl().textContent();
    expect(gitUrlText).toContain('ssh://git@example.com/lagoon-demo.git');
  }

  async doDetailsCheck(): Promise<void> {
    await expect(this.project.getGitUrl()).not.toBeEmpty();
    await expect(this.project.getBranchesField()).not.toBeEmpty();
    await expect(this.project.getCreatedField()).not.toBeEmpty();
    await expect(this.project.getDevEnvsField()).not.toBeEmpty();
    await expect(this.project.getPullRequestsField()).not.toBeEmpty();
  }

  async doExternalLinkCheck(): Promise<void> {
    await expect(this.project.getGitUrl().filter({ hasText: 'lagoon-demo' })).toBeVisible();
  }

  async doEnvRouteCheck(): Promise<void> {
    const envRows = this.project.getEnvNames();
    const count = await envRows.count();

    for (let i = 0; i < count; i++) {
      const row = envRows.nth(i);
      const link = row.locator('a');
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  }

  async doCreateDummyEnv(page: Page): Promise<void> {
    await this.project.getEnvBtn().click();
    await this.project.getBranchNameInput().fill('123123');

    // 3 step process
    await this.project.getNextStepButton().click();
    await this.project.getNextStepButton().click();
    await this.project.getNextStepButton().click();

    await expect(this.project.getEnvNames().filter({ hasText: '123123' })).toBeVisible();
  }

  async doCreateEnvWithPermissionError(page: Page): Promise<void> {
    await this.project.getEnvBtn().click();
    await this.project.getBranchNameInput().fill('123123');

    // 3 step process
    await this.project.getNextStepButton().click();
    await this.project.getNextStepButton().click();
    await this.project.getNextStepButton().click();

    await expect(this.project.getNotification()).toBeVisible();
    await expect(this.project.getNotification()).toContainText('There was a problem creating environment.');
  }
}

