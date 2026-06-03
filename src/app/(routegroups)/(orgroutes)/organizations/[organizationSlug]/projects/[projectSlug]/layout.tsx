import CloningInProgressPage from '@/components/errors/CloningInProgressPage';
import { getClient } from '@/lib/apolloClient';
import projectRestrictionsQuery from '@/lib/query/projectRestrictionsQuery';

type ProjectRestrictionsData = {
  project: {
    id: number;
    name: string;
    restrictions: string[] | null;
    clone: {
      id: number;
      status: string;
    } | null;
  } | null;
};

export default async function OrgProjectLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ projectSlug: string }>;
}>) {
  const { projectSlug } = await params;

  const client = await getClient();
  const { data } = await client.query<ProjectRestrictionsData>({
    query: projectRestrictionsQuery,
    variables: { name: projectSlug },
  });

  const restrictions = data?.project?.restrictions;
  const cloneStatus = data?.project?.clone?.status;
  const isRestricted = restrictions && restrictions.length > 0;

  if (isRestricted) {
    return <CloningInProgressPage projectName={projectSlug} cloneStatus={cloneStatus} />;
  }

  return <>{children}</>;
}
