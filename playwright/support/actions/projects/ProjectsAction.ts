import { Page, expect } from '@playwright/test';
import ProjectRepository from '../../repositories/projects/ProjectsRepository';

export default class ProjectAction {
  private projectRepo: ProjectRepository;

  constructor(page: Page) {
    this.projectRepo = new ProjectRepository(page);
  }

  async doPageCheck(): Promise<void> {
    await expect(this.projectRepo.getPageTitle()).toContainText('Projects');
  }

  async doSearch(): Promise<void> {
    await this.projectRepo.getSearchBar().fill('lagoon-demo');
    await expect(this.projectRepo.getProjects()).toHaveCount(1);
  }

  async doEmptySearch(): Promise<void> {
    await this.projectRepo.getSearchBar().fill('This does not exist');
    await expect(this.projectRepo.getNotMatched()).toBeVisible();
  }

  async doProjectLengthCheck(): Promise<void> {
    const lengthCounterText = await this.projectRepo.getLengthCounter().textContent();
    if (lengthCounterText) {
      const numberMatch = lengthCounterText.match(/\d+/);
      if (numberMatch) {
        const numberOfProjects = parseInt(numberMatch[0], 10);
        await expect(this.projectRepo.getProjects()).toHaveCount(numberOfProjects);
      } else {
        throw new Error('Failed to extract the number of projects from the element.');
      }
    }
  }

  async doChangeNumberOfResults(val: number | string, page: Page): Promise<void> {
    await this.projectRepo.getResultSelector().click();
    await this.projectRepo
      .getResultMenu()
      .locator('.ant-select-item-option-content')
      .filter({ hasText: String(val) })
      .click();

    const expectedLimit = val !== 'All' ? `?results=${val}` : '?results=-1';
    await expect(page).toHaveURL(new RegExp(`.*${expectedLimit.replace('?', '\\?')}`));
  }
}

