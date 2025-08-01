'use client';

import { Description } from '@/components/pages/organizations/organization/_components/Description';
import {CreateProject} from "@/components/createProject/CreateProject";
import {CreateGroup} from "@/components/createGroup/CreateGroup";
import {AddUser} from "@/components/addUserToOrg/Adduser";
import {TabNavigation, DetailStat} from "@uselagoon/ui-library";
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import {organizationNavItems} from "@/components/shared/organizationNavItems";
import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';

export default function Loading() {
  const orgSkeletonItems = [
    {
      key: 'org_id',
      label: 'ORG ID',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'org_name',
      label: 'ORG NAME',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'groups',
      label: 'GROUPS',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'projects',
      label: 'PROJECTS',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'notifications',
      label: 'NOTIFICATIONS',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'environments',
      label: 'ENVIRONMENTS',
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
    {
      key: 'dev_envs',
      label: 'AVAILABLE DEPLOY TARGETS',
      contentStyle: {
        padding: 0,
      },
      children: <div className="bg-accent animate-pulse rounded-md" >Loading..</div>,
    },
  ];

    const navItems = organizationNavItems("loading");

  return (
      <>
        <OrgBreadcrumbs />
        <TabNavigation items={navItems} pathname={""}></TabNavigation>
        <SectionWrapper>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>
          <p>Key information about your organization</p>
          <Description loading />

          <div className="flex flex-wrap flex-col gap-4 mb-4">
            <CreateProject organizationId={0} options={[]} />
            <CreateGroup organizationId={0} existingGroupNames={[]} />
            <AddUser groupOptions={[]} type="multiple" />
          </div>

          <div className="flex flex-wrap justify-between max-w-7xl mx-auto gap-y-4 text-center">
            {orgSkeletonItems.map((item) => (
              <DetailStat title={item.label} value={item.children} key={item.key}  />
            ))}
          </div>
        </SectionWrapper>
        </>
  );
}
