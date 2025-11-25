import { Page } from '@playwright/test';


export const waitForNetworkIdle = async (page: Page, timeout: number = 500): Promise<void> => {
  await page.waitForLoadState('networkidle', { timeout });
};

