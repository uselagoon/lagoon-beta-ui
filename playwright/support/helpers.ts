import { Locator, Page, expect } from '@playwright/test';

export function getBySel(page: Page, selector: string): Locator {
  return page.locator(`[data-cy=${selector}]`);
}

export async function login(
  page: Page,
  username: string,
  password: string,
  baseUrl: string = 'http://0.0.0.0:3000'
): Promise<void> {
  await page.goto(baseUrl);

  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('#kc-login');
  await page.waitForLoadState('networkidle');
  const sessionResponse = await page.request.get('/api/auth/session');
  const sessionBody = await sessionResponse.json();
  if (sessionBody.error) {
    throw new Error('Login failed - session error');
  }
}

export async function gqlQuery(
  page: Page,
  operationName: string,
  query: string,
  variables?: Record<string, any>,
  graphqlEndpoint: string = 'http://0.0.0.0:33000/graphql'
): Promise<any> {
  const requestBody = {
    operationName,
    query,
    ...(variables ? { variables } : {}),
  };

  const response = await page.request.post(graphqlEndpoint, {
    data: requestBody,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await response.json();
}

export async function gqlMutation(
  page: Page,
  operationName: string,
  mutation: string,
  variables?: Record<string, any>,
  graphqlEndpoint: string = 'http://0.0.0.0:3000/graphql'
): Promise<any> {
  return gqlQuery(page, operationName, mutation, variables, graphqlEndpoint);
}
