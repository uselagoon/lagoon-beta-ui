import React, { Suspense } from 'react';

import { DocumentNode, OperationVariables, QueryRef, TypedDocumentNode, useBackgroundQuery } from '@apollo/client';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-gray-400">Loading...</div>
  </div>
);

interface MockPreloadQueryProps<TData, TVariables extends OperationVariables> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
  mockData?: TData;
  children: (queryRef: QueryRef<TData>) => React.ReactNode;
}

function QueryRefProvider<TData, TVariables extends OperationVariables>({
  query,
  variables,
  children,
}: {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
  children: (queryRef: QueryRef<TData>) => React.ReactNode;
}) {
  const [queryRef] = useBackgroundQuery<TData, TVariables>(query, {
    variables,
  });

  return <>{children(queryRef)}</>;
}

export function MockPreloadQuery<TData, TVariables extends OperationVariables>({
  query,
  variables,
  mockData,
  children,
}: MockPreloadQueryProps<TData, TVariables>) {
  if (mockData === undefined) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <QueryRefProvider<TData, TVariables> query={query} variables={variables}>
          {children}
        </QueryRefProvider>
      </Suspense>
    );
  }

  const mocks = [
    {
      request: {
        query,
        variables,
      },
      result: {
        data: mockData,
      },
    },
    {
      request: {
        query,
        variables,
      },
      result: {
        data: mockData,
      },
    },
  ] as MockedResponse[];

  return (
    <MockedProvider mocks={mocks} addTypename={false}>
      <Suspense fallback={<LoadingFallback />}>
        <QueryRefProvider<TData, TVariables> query={query} variables={variables}>
          {children}
        </QueryRefProvider>
      </Suspense>
    </MockedProvider>
  );
}

export interface StoryMockConfig<TData, TVariables extends OperationVariables> {
  query: DocumentNode | TypedDocumentNode<TData, TVariables>;
  variables?: TVariables;
  data: TData;
}

export function createMocksFromConfig<TData, TVariables extends OperationVariables>(
  configs: StoryMockConfig<TData, TVariables>[]
): MockedResponse[] {
  return configs.flatMap(
    config =>
      [
        {
          request: {
            query: config.query,
            variables: config.variables,
          },
          result: {
            data: config.data,
          },
        },
        {
          request: {
            query: config.query,
            variables: config.variables,
          },
          result: {
            data: config.data,
          },
        },
      ] as MockedResponse[]
  );
}

export default MockPreloadQuery;
