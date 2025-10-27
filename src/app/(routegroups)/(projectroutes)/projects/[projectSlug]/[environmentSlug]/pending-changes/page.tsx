import PendingChangesPage from '@/components/pages/pendingChanges/PendingChangesPage';
import { PreloadQuery } from '@/lib/apolloClient';
import environmentByOpenShiftProjectName from '@/lib/query/environmentByOpenShiftProjectName';
import { QueryRef } from '@apollo/client';

type Props = {
  params: Promise<{ environmentSlug: string }>;
};

export type PendingChange = {
    type: string;
    details: string;
    date: string;
};

type Environment = {
  id: number;
  openshiftProjectName: string;
  project: {
    name: string;
    problemsUi: boolean;
    factsUi: boolean;
  };
  pendingChanges: PendingChange[];
};

export interface PendingChangesData {
  environment: Environment;
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  return {
    title: `${params.environmentSlug} | Pending Changes`,
  };
}

export default async function PendingChanges(props: { params: Promise<{ environmentSlug: string }> }) {
  const params = await props.params;

  const { environmentSlug } = params;

  return (
    <PreloadQuery
      query={environmentByOpenShiftProjectName}
      variables={{
        displayName: 'Pending Changes',
        openshiftProjectName: environmentSlug,
        limit: null,
      }}
    >
      {queryRef => <PendingChangesPage environmentSlug={environmentSlug} queryRef={queryRef as QueryRef<PendingChangesData>} />}
    </PreloadQuery>
  );
}
