import { Page, Locator } from '@playwright/test';

export default class ProjectRepository {
  constructor(private page: Page) {}

  getPageTitle(): Locator {
    return this.page.locator('[data-cy=page-title]');
  }

  getSearchBar(): Locator {
    return this.page.locator('[data-cy=search-bar]');
  }

  getLengthCounter(): Locator {
    return this.page.locator('[data-cy=projects-total]');
  }

  getProjects(): Locator {
    return this.page.locator('[data-cy=project-row]');
  }

  getNotMatched(): Locator {
    return this.page.locator('[data-cy=empty]');
  }

  getResultSelector(): Locator {
    return this.page.locator('[data-cy=select-results]');
  }

  getResultMenu(): Locator {
    return this.page.locator('[data-cy=select-menu]');
  }
}

