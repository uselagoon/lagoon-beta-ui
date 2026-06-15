'use client';

import { useSession } from 'next-auth/react';
import { useEnvContext } from '@/contexts/EnvContext';

import { ApolloLink, HttpLink, ServerError, FetchResult, Observable, Operation } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloClient, ApolloNextAppProvider, InMemoryCache } from '@apollo/experimental-nextjs-app-support';
import { createClient } from 'graphql-sse';
import { print } from 'graphql';
import manualSignOut from 'utils/manualSignOut';

/*
 * reference: https://www.npmjs.com/package/@apollo/client-integration-nextjs
 */

/*
  makeclient runs once and persists throughout the entire lifecycle of ApolloNextAppProvider.
*/
function makeClient(
  GRAPHQL_API: string,
  SSE_URI: string,
  disableSubscriptions: boolean,
  getAccessToken: () => string | null
) {
  const httpLink = new HttpLink({
    uri: GRAPHQL_API,
    fetchOptions: { cache: 'no-store' },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { cache: "force-cache" }}});
  });
  const asyncAuthLink = setContext(async (_, { headers }) => {
    try {
      const response = await fetch('/api/auth/session'); // same as useSession() in components
      const data = response.ok ? await response.json() : null;

      if (!data) {
        await manualSignOut();
        return;
      }

      return {
        headers: {
          ...headers,
          authorization: `Bearer ${data.access_token}`,
        },
      };
    } catch (error) {
      // catch all signout
      await manualSignOut();
    }
  });

  const HttpSseLink = () => {
    if (disableSubscriptions) {
      return httpLink;
    }

    class SSELink extends ApolloLink {
      private sseClient;

      constructor() {
        super();
        this.sseClient = createClient({
          url: SSE_URI,
          // todo: fetch a new token on reconnect
          retryAttempts: 3,
          headers: async () => {
            const response = await fetch('/api/auth/session');
            const data = response.ok ? await response.json() : null;
            if (!data?.access_token) return {} as Record<string, string>;
            return { authorization: `Bearer ${data.access_token}` };
          },
        });
      }

      public request(operation: Operation): Observable<FetchResult> {
        return new Observable((sink) => {
          return this.sseClient.subscribe<Record<string, any>>(
            { ...operation, query: print(operation.query) },
            {
              next: sink.next.bind(sink) as any,
              complete: sink.complete.bind(sink),
              error: sink.error.bind(sink),
            }
          );
        });
      }
    }

    return ApolloLink.split(
      ({ query }) => {
        let definition = getMainDefinition(query);
        return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
      },
      new SSELink(),
      httpLink
    );
  };
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`
        )
      );
    }
    if (networkError) {
      console.log('[Network error]', networkError);
      if ((networkError as ServerError)?.statusCode === 401) {
        manualSignOut();
      }
    }
  });

  const client = new ApolloClient({
    cache: new InMemoryCache({
      // client only fields for deferred individual queries
      typePolicies: {
        OrgGroup: {
          fields: {
            memberCount: {
              read(existing) {
                return existing ?? null;
              },
            },
          },
        },
        OrgProject: {
          fields: {
            groupCount: {
              read(existing) {
                return existing ?? null;
              },
            },
          },
        },
      },
    }),
    link: asyncAuthLink.concat(
      ApolloLink.from([
        errorLink,
        // disable websockets when rendering server side.
        typeof window === 'undefined' ? httpLink : HttpSseLink(),
      ])
    ),
  });

  return client;
}

export function ApolloClientComponentWrapper({ children }: React.PropsWithChildren) {
  const { data: session, status } = useSession();

  const { GRAPHQL_API, DISABLE_SUBSCRIPTIONS } = useEnvContext();

  const sse_uri = GRAPHQL_API!.replace(/\/?$/, '/stream');
  const disableSubs = DISABLE_SUBSCRIPTIONS?.toLowerCase() === 'true';

  if (status === 'loading' || !session) {
    return null;
  }

  const client = makeClient(GRAPHQL_API!, sse_uri, disableSubs, () => session?.access_token ?? null);

  // dynamically updating access_token: https://github.com/apollographql/apollo-client-nextjs/issues/103#issuecomment-1790941212
  client.defaultContext.token = session?.access_token;

  return <ApolloNextAppProvider makeClient={() => client}>{children}</ApolloNextAppProvider>;
}
