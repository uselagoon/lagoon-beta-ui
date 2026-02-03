import React, { Suspense } from 'react';

import { ApolloClient, ApolloProvider, gql, HttpLink, InMemoryCache } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Decorator, StoryContext } from '@storybook/react';

declare global {
  var __STORYBOOK_APOLLO_LAST_ID__: string | null;
  var __STORYBOOK_APOLLO_CLIENT__: ApolloClient<unknown> | null;
}

globalThis.__STORYBOOK_APOLLO_LAST_ID__ ??= null;
globalThis.__STORYBOOK_APOLLO_CLIENT__ ??= null;

const MeQueryAlias = gql`
  query Me {
    me {
      id
      firstName
      lastName
      email
      emailNotifications {
        sshKeyChanges
        groupRoleChanges
        organizationRoleChanges
      }
      sshKeys {
        id
        name
        keyType
        keyValue
        created
        lastUsed
        keyFingerprint
      }
      has2faEnabled
      isFederatedUser
    }
  }
`;

const createMSWApolloClient = () => {
  const client = new ApolloClient({
    link: new HttpLink({
      uri: '/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
      query: {
        fetchPolicy: 'network-only',
      },
    },
  });

  client.watchQuery({ query: MeQueryAlias, fetchPolicy: 'network-only' }).subscribe({
    next: () => {},
    error: () => {},
  });

  return client;
};

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
  const { parameters } = context;
  const mocks: MockedResponse[] = parameters?.apolloMocks || [];
  const useMSW = parameters?.useMSW !== false;
  const storyId = context.id;

  if (globalThis.__STORYBOOK_APOLLO_LAST_ID__ !== storyId || !globalThis.__STORYBOOK_APOLLO_CLIENT__) {
    globalThis.__STORYBOOK_APOLLO_CLIENT__ = createMSWApolloClient();
    globalThis.__STORYBOOK_APOLLO_LAST_ID__ = storyId;
  }

  const mswClient = globalThis.__STORYBOOK_APOLLO_CLIENT__;

  if (useMSW && mocks.length === 0) {
    return (
      <ApolloProvider client={mswClient}>
        <Suspense fallback={<LoadingFallback />}>
          <Story />
        </Suspense>
      </ApolloProvider>
    );
  }

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
