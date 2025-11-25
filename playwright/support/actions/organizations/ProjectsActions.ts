import { Page, expect } from '@playwright/test';
import ProjectsRepository from '../../repositories/organizations/ProjectsRepository';
import { waitForGraphQL } from '../../graphql-interceptor';

type ProjectData = {
  projectName: string;
  gitUrl: string;
  prodEnv: string;
};

export default class ProjectsActions {
  private projects: ProjectsRepository;

  constructor(page: Page) {
    this.projects = new ProjectsRepository(page);
  }

  async doAddProject(projectData: ProjectData, page: Page): Promise<void> {
    await this.projects.getAddBtn().click();
    await this.projects.getNameInput().fill(projectData.projectName);
    await this.projects.getGitInput().fill(projectData.gitUrl);
    await this.projects.getEnvInput().fill(projectData.prodEnv);
    await this.projects.selectTarget();
    await this.projects.getConfirmBtn().click();

    await waitForGraphQL(page, 'addProjectToOrganization', true);
    await expect(this.projects.getProjectRows().filter({ hasText: projectData.projectName })).toBeVisible();
  }

  async doFailedaddProject(projectData: ProjectData, page: Page): Promise<void> {
    await this.projects.getAddBtn().click();
    await this.projects.getNameInput().fill(projectData.projectName);
    await this.projects.getGitInput().fill(projectData.gitUrl);
    await this.projects.getEnvInput().fill(projectData.prodEnv);
    await this.projects.selectTarget();
    await this.projects.getConfirmBtn().click();

    const responseBody = await waitForGraphQL(page, 'addProjectToOrganization', true);
    const errorMessage = `Unauthorized: You don't have permission to "addProject" on "organization"`;
    expect(responseBody).toHaveProperty('errors');
    expect(responseBody.errors[0]).toHaveProperty('message', errorMessage);
  }

  async doDeleteProject(projectName: string, page: Page): Promise<void> {
    await this.projects.getDeleteBtn(projectName).click();
    await this.projects.getDeleteConfirm().fill(projectName);
    await this.projects.getConfirmBtn().click();

    await waitForGraphQL(page, 'deleteProject', true);
    await expect(this.projects.getProjectRows().filter({ hasText: projectName })).not.toBeVisible();
  }
}

