import { Page, Locator } from '@playwright/test';

export default class NavigationRepository {
  constructor(private page: Page) {}

  getLinkElement(selector: string): Locator {
    return this.page.locator(`[data-cy=${selector}]`);
  }
}

