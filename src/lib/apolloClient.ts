import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { print } from 'graphql';
// subscsriptions
import { createClient } from 'graphql-sse';

import { auth } from '../auth';

export const { getClient, PreloadQuery, query } = registerApolloClient(async () => {
  const session = await auth();

  const GRAPHQL_API = process.env.GRAPHQL_API;
  const WEBSOCKET_URI = process.env.GRAPHQL_API!.replace(/https/, 'wss').replace(/http/, 'ws');
  const SSE_URI = GRAPHQL_API!.replace(/\/?$/, '/stream');

  const disableSubscriptions = process.env.DISABLE_SUBSCRIPTIONS?.toLowerCase() === 'true';

  const httpLink = new HttpLink({
    uri: GRAPHQL_API,
    headers: {
      authorization: `Bearer ${session?.access_token}`,
    },
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
          headers: () => {
            if (!session) return {} as Record<string, string>;
            return { Authorization: `Bearer ${session?.access_token}` };
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
    }
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      errorLink,
      // Disable websockets when rendering server side.
      typeof window === 'undefined' ? httpLink : HttpSseLink(),
    ]),
  });
});
