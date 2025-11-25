import { test as base } from '@playwright/test';
import { login, getBySel, gqlQuery, gqlMutation } from './helpers';

type CustomFixtures = {
  getBySel: (selector: string) => ReturnType<typeof getBySel>;
  login: (username: string, password: string) => Promise<void>;
  gqlQuery: (operationName: string, query: string, variables?: Record<string, any>) => Promise<any>;
  gqlMutation: (operationName: string, mutation: string, variables?: Record<string, any>) => Promise<any>;
};

export const test = base.extend<CustomFixtures>({
  getBySel: async ({ page }, use) => {
    await use((selector: string) => getBySel(page, selector));
  },
  login: async ({ page }, use) => {
    await use((username: string, password: string) => login(page, username, password));
  },
  gqlQuery: async ({ page }, use) => {
    await use((operationName: string, query: string, variables?: Record<string, any>) => 
      gqlQuery(page, operationName, query, variables)
    );
  },
  gqlMutation: async ({ page }, use) => {
    await use((operationName: string, mutation: string, variables?: Record<string, any>) => 
      gqlMutation(page, operationName, mutation, variables)
    );
  },
});

export { expect } from '@playwright/test';

