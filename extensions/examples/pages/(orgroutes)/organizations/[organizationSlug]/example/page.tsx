'use client';

import { useParams } from 'next/navigation';
import { useQuery, gql } from '@apollo/client';
import { DetailStat, Skeleton } from '@/ui-library';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';

const ORGANIZATION_OVERVIEW_QUERY = gql`
  query getOrganizationOverview($name: String!) {
    organization: organizationByName(name: $name) {
      id
      name
      friendlyName
      quotaProject
      quotaGroup
      quotaEnvironment
      projects { id }
      groups { id }
      environments { id }
    }
  }
`;

type Organization = {
  id: number;
  name: string;
  friendlyName: string;
  quotaProject: number;
  quotaGroup: number;
  quotaEnvironment: number;
  projects: { id: number }[];
  groups: { id: number }[];
  environments: { id: number }[];
};

export default function OrganizationOverviewPage() {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();

  const { data, loading, error } = useQuery<{ organization: Organization }>(
    ORGANIZATION_OVERVIEW_QUERY,
    { variables: { name: organizationSlug } }
  );

  if (loading) {
    const skeletonItems = [
      { key: 'projects',     title: 'PROJECTS' },
      { key: 'groups',       title: 'GROUPS' },
      { key: 'environments', title: 'ENVIRONMENTS' },
    ];

    return (
      <SectionWrapper>
        <Skeleton className="w-[200px] h-8 mb-2" />
        <Skeleton className="w-[320px] h-4 mb-6" />
        <div className={'grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))] [&>div[data-slot=card]]:w-full [&>div[data-slot=card]]:max-w-full [&>div[data-slot=card]]:min-w-[370px]'}>
          {skeletonItems.map(item => (
            <DetailStat key={item.key} title={item.title} value={<Skeleton className="w-[150px] h-8" />} />
          ))}
        </div>
      </SectionWrapper>
    );
  }

  if (error || !data?.organization) {
    return (
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>
        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          Failed to load organization data.
        </span>
      </SectionWrapper>
    );
  }

  const { organization } = data;

  const statItems = [
    {
      key: 'projects',
      title: 'PROJECTS',
      value: `${organization.projects.length} / ${organization.quotaProject}`,
    },
    {
      key: 'groups',
      title: 'GROUPS',
      value: `${organization.groups.length} / ${organization.quotaGroup}`,
    },
    {
      key: 'environments',
      title: 'ENVIRONMENTS',
      value: `${organization.environments.length} / ${organization.quotaEnvironment}`,
    },
  ];

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {organization.friendlyName || organization.name}
      </h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Overview of resources and quotas for this organization.
      </span>
      <div className={'grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))] [&>div[data-slot=card]]:w-full [&>div[data-slot=card]]:max-w-full [&>div[data-slot=card]]:min-w-[370px]'}>
        {statItems.map(item => (
          <DetailStat key={item.key} title={item.title} value={item.value} />
        ))}
      </div>
    </SectionWrapper>
  );
}
