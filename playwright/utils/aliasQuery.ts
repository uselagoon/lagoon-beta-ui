import { APIRequestContext } from '@playwright/test';

export interface GraphQLRequest {
  operationName?: string;
  query?: string;
  mutation?: string;
  variables?: Record<string, any>;
}

const hasOperationName = (body: any, operationName: string): boolean => {
  return body && Object.hasOwn(body, 'operationName') && body.operationName === operationName;
};

export const aliasQuery = (req: { body: any }, operationName: string): string | null => {
  if (hasOperationName(req.body, operationName)) {
    return `gql${operationName}Query`;
  }
  return null;
};

export const aliasMutation = (req: { body: any }, operationName: string): string | null => {
  if (hasOperationName(req.body, operationName)) {
    return `gql${operationName}Mutation`;
  }
  return null;
};

