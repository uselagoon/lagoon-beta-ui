import { Page } from '@playwright/test';

import { GraphQLInterceptor, waitForGraphQL } from './graphql-interceptor';

export const env = {
  api: 'http://0.0.0.0:3000/graphql',
  keycloak: 'http://localhost:8088/auth/realms/lagoon',
  url: 'http://0.0.0.0:3004',
  user_guest: 'guest@example.com',
  user_reporter: 'reporter@example.com',
  user_developer: 'developer@example.com',
  user_maintainer: 'maintainer@example.com',
  user_owner: 'owner@example.com',
  user_orguser: 'orguser@example.com',
  user_orgviewer: 'orgviewer@example.com',
  user_orgadmin: 'orgadmin@example.com',
  user_orgowner: 'orgowner@example.com',
  user_platformowner: 'platformowner@example.com',
};

export function setupGraphQLInterception(page: Page): GraphQLInterceptor {
  return new GraphQLInterceptor(page, env.api);
}

export { waitForGraphQL };
export async function loginUser(page: Page, username: string, password?: string): Promise<void> {
  const userPassword = password || username;
  await page.goto(env.url);
  await page.fill('#username', username);
  await page.fill('#password', userPassword);
  await page.click('#kc-login');
  await page.waitForLoadState('networkidle');
  const pageUrl = `${env.url}/api/auth/session`;
  const sessionResponse = await page.request.get(pageUrl);
  const sessionBody = await sessionResponse.json();
  if (sessionBody?.error) {
    throw new Error('Login failed - session error');
  }
}
