'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddUser } from '@/components/addUserToOrg/Adduser';
import { CreateGroup } from '@/components/createGroup/CreateGroup';
import { CreateProject } from '@/components/createProject/CreateProject';
import { Description } from '@/components/pages/organizations/organization/_components/Description';
import { DetailStat, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  const orgSkeletonItems = [
    {
      key: 'org_id',
      label: 'ORG ID',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'org_name',
      label: 'ORG NAME',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'groups',
      label: 'GROUPS',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'projects',
      label: 'PROJECTS',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'notifications',
      label: 'NOTIFICATIONS',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'environments',
      label: 'ENVIRONMENTS',
      children: <Skeleton className="h-8 w-[150px]" />,
    },
    {
      key: 'dev_envs',
      label: 'AVAILABLE DEPLOY TARGETS',
      contentStyle: {
        padding: 0,
      },
      children: <Skeleton className="h-8 w-[150px]" />,
    },
  ];

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>

        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          Key information about your organization
        </span>

        <Description loading />

        <div className="flex gap-4 my-10">
          <CreateProject organizationId={0} options={[]} />
          <CreateGroup organizationId={0} existingGroupNames={[]} />
          <AddUser groupOptions={[]} type="multiple" />
        </div>

        <div className="flex flex-wrap justify-between max-w-7xl mx-auto gap-y-4">
          {orgSkeletonItems.map(item => (
            <DetailStat title={item.label} value={item.children} key={item.key} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
