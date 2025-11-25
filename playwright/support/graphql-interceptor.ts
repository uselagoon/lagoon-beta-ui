import { Page, Route, Request, Response } from '@playwright/test';

export interface GraphQLRequest {
  operationName?: string;
  query?: string;
  mutation?: string;
  variables?: Record<string, any>;
}

export class GraphQLInterceptor {
  private page: Page;
  private apiUrl: string;
  private interceptedRequests: Map<string, Request[]> = new Map();

  constructor(page: Page, apiUrl: string = 'http://0.0.0.0:33000/graphql') {
    this.page = page;
    this.apiUrl = apiUrl;
  }

  start(): void {
    this.page.route(this.apiUrl, (route: Route) => {
      const request = route.request();
      const postData = request.postDataJSON() as GraphQLRequest;
      
      if (postData?.operationName) {
        const operationName = postData.operationName;
        const isMutation = postData.mutation || !postData.query;
        const alias = isMutation 
          ? `gql${operationName}Mutation`
          : `gql${operationName}Query`;
        
        if (!this.interceptedRequests.has(alias)) {
          this.interceptedRequests.set(alias, []);
        }
        this.interceptedRequests.get(alias)!.push(request);
      }
      
      route.continue();
    });
  }

  async waitForOperation(alias: string, timeout?: number): Promise<Request> {
    return new Promise((resolve, reject) => {
      const timeoutId = timeout 
        ? setTimeout(() => reject(new Error(`Timeout waiting for ${alias}`)), timeout)
        : null;

      const checkForRequest = () => {
        const requests = this.interceptedRequests.get(alias);
        if (requests && requests.length > 0) {
          if (timeoutId) clearTimeout(timeoutId);
          resolve(requests[requests.length - 1]);
          return;
        }
        setTimeout(checkForRequest, 50);
      };

      checkForRequest();
    });
  }

  async waitForResponse(alias: string, timeout: number = 30000): Promise<any> {
    await this.waitForOperation(alias);
    const response = await this.page.waitForResponse(
      (response) => {
        const url = response.url();
        if (!url.includes('/graphql')) return false;
        const request = response.request();
        const postData = request.postDataJSON() as GraphQLRequest;
        if (!postData?.operationName) return false;
        
        const operationName = postData.operationName;
        const isMutation = postData.mutation || !postData.query;
        const expectedAlias = isMutation ? `gql${operationName}Mutation` : `gql${operationName}Query`;
        return expectedAlias === alias;
      },
      { timeout }
    );

    return response.json();
  }

  clear(): void {
    this.interceptedRequests.clear();
  }

  stop(): void {
    this.page.unroute(this.apiUrl);
  }
}

export function createGraphQLAlias(operationName: string, isMutation: boolean = false): string {
  return isMutation 
    ? `gql${operationName}Mutation`
    : `gql${operationName}Query`;
}

export async function waitForGraphQL(
  page: Page,
  operationName: string,
  isMutation: boolean = false,
  timeout: number = 30000
): Promise<any> {
  const response = await page.waitForResponse(
    (response: Response) => {
      const url = response.url();
      if (!url.includes('/graphql')) return false;
      
      const request = response.request();
      let postData: GraphQLRequest;
      
      try {
        postData = request.postDataJSON() as GraphQLRequest;
      } catch {
        return false;
      }
      
      if (!postData?.operationName) return false;
      
      return postData.operationName === operationName;
    },
    { timeout }
  );

  return response.json();
}
