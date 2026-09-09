import EnvironmentPage from '@/components/pages/environment/EnvironmentPage';
import { keyFactImageType } from '@/constants/keyFactImageMap';
import { PreloadQuery } from '@/lib/apolloClient';
import environmentByKubernetesNamespaceName from '@/lib/query/environmentByKubernetesNamespaceName';
import { QueryRef } from '@apollo/client';

type Props = {
  params: Promise<{ environmentSlug: string }>;
};

export type FactType = {
  id: number;
  name: keyFactImageType;
  value: string;
  source: string;
  description: string;
  keyFact: boolean;
  type: string;
  category: string;
  service: string;
};

export type EnvironmentData = {
  environment: {
    id: number;
    name: string;
    created: string;
    updated: string;
    deployType: string;
    environmentType: string;
    routes: string;
    kubernetesNamespaceName: string;
    project: {
      name: string;
      gitUrl: string;
      productionRoutes: string | null;
      standbyRoutes: string | null;
      productionEnvironment: string;
      standbyProductionEnvironment: string | null;
      problemsUi: number | null;
      factsUi: number | null;
    };
    title: string;
    facts: FactType[];
    pendingChanges: Array<{ details: string }>;
  };
};

export async function generateMetadata(props: Props) {
  const params = await props.params;
  return {
    title: `${params.environmentSlug} | Environment`,
  };
}

export default async function Environment(props: {
  params: Promise<{ environmentSlug: string; projectSlug: string }>;
}) {
  const params = await props.params;

  const { environmentSlug, projectSlug } = params;

  return (
    <PreloadQuery
      query={environmentByKubernetesNamespaceName}
      variables={{
        displayName: 'Environment',
        kubernetesNamespaceName: environmentSlug,
      }}
    >
      {queryRef => (
        <EnvironmentPage environmentSlug={environmentSlug} queryRef={queryRef as QueryRef<EnvironmentData>} />
      )}
    </PreloadQuery>
  );
}
