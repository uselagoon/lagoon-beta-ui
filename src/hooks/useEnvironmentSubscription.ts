import { DocumentNode, Reference, StoreObject, useSubscription } from '@apollo/client';

import { useEnvContext } from '@/contexts/EnvContext';

const ZERO_DATE = '0000-00-00 00:00:00';

type Options = {
  subscription: DocumentNode;
  fragment: DocumentNode;
  fragmentName: string;
  typename: string;
  dataKey: string;
  listField: 'backups' | 'deployments' | 'tasks';
  environmentId?: number;
};

export function useEnvironmentSubscription({
  subscription,
  fragment,
  fragmentName,
  typename,
  dataKey,
  listField,
  environmentId,
}: Options) {
  const { DISABLE_SUBSCRIPTIONS } = useEnvContext();
  const disabled = DISABLE_SUBSCRIPTIONS?.toLowerCase() === 'true';

  useSubscription(subscription, {
    variables: { environment: environmentId },
    skip: disabled || environmentId === undefined,
    onData: ({ client, data }) => {
      const incoming = data.data?.[dataKey];
      if (!incoming) return;

      const cache = client.cache;
      const environmentCacheId = cache.identify({ __typename: 'Environment', id: environmentId });
      if (!environmentCacheId) return;

      const isDeleted = incoming.deleted !== undefined && incoming.deleted !== null && incoming.deleted !== ZERO_DATE;
      const itemId = cache.identify({ __typename: typename, id: incoming.id });

      const ref = isDeleted
        ? undefined
        : cache.writeFragment({
            id: itemId,
            fragment,
            fragmentName,
            data: { __typename: typename, ...incoming },
          });

      cache.modify({
        id: environmentCacheId,
        fields: {
          [listField]: ((existing: readonly Reference[] = [], { readField }: { readField: any }) => {
            const index = existing.findIndex(item => readField('id', item) === incoming.id);
            if (isDeleted) {
              return index === -1 ? existing : existing.filter((_, i) => i !== index);
            }
            if (index === -1) return ref ? [ref, ...existing] : existing;
            return existing;
          }) as any,
        },
      });
    },
  });
}
