import { Page, Locator } from '@playwright/test';

export default class OverviewRepository {
  constructor(private page: Page) {}

  getElement(selector: string): Locator {
    return this.page.locator(`[data-cy=${selector}]`);
  }

  getLinkElement(selector: string): Locator {
    return this.getElement(selector);
  }

  getFieldElement(selector: string): Locator {
    return this.getElement(selector);
  }

  getNameEditButton(selector: string): Locator {
    return this.getElement(selector);
  }

  getfriendlyName(): Locator {
    return this.getElement('friendly-name');
  }

  getDescription(): Locator {
    return this.getElement('org-description');
  }

  getEditField(): Locator {
    return this.getElement('edit-input');
  }

  getSubmitButton(): Locator {
    return this.getElement('modal-confirm');
  }

  getCancelButton(): Locator {
    return this.getElement('modal-cancel');
  }

  getDescEditButton(selector: string): Locator {
    return this.getElement(selector);
  }
}

