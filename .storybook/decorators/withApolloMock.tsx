import React, { Suspense } from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Decorator, StoryContext } from '@storybook/react';

import { UserRole } from '../types';

const createMockApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
      query: {
        fetchPolicy: 'no-cache',
      },
    },
  });
};

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-gray-400">Loading...</div>
  </div>
);

export const withApolloMock: Decorator = (Story, context: StoryContext) => {
  const { parameters, globals } = context;
  const mocks: MockedResponse[] = parameters?.apolloMocks || [];
  const userRole: UserRole = globals?.userRole || 'owner';

  if (mocks.length === 0) {
    const client = createMockApolloClient();
    return (
      <ApolloProvider client={client}>
        <Suspense fallback={<LoadingFallback />}>
          <Story />
        </Suspense>
      </ApolloProvider>
    );
  }

  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Suspense fallback={<LoadingFallback />}>
        <Story />
      </Suspense>
    </MockedProvider>
  );
};

export default withApolloMock;

export const createQueryMock = <TData, TVariables>(
  query: any,
  variables: TVariables,
  data: TData
): MockedResponse => ({
  request: {
    query,
    variables,
  },
  result: {
    data,
  },
});

export const createErrorMock = <TVariables,>(
  query: any,
  variables: TVariables,
  errorMessage: string
): MockedResponse => ({
  request: {
    query,
    variables,
  },
  error: new Error(errorMessage),
});
