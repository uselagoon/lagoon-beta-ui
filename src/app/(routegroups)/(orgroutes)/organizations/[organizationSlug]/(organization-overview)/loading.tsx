'use client';

import { Description } from '@/components/pages/organizations/organization/_components/Description';
import { OrgActionsWrapper } from '@/components/pages/organizations/organization/_components/styles';
import {CreateProject} from "@/components/createProject/CreateProject";
import {CreateGroup} from "@/components/createGroup/CreateGroup";
import {AddUser} from "@/components/addUserToOrg/Adduser";
import {Breadcrumb, TabNavigation, DetailStat} from "@uselagoon/ui-library";
import Link from "next/link";
import TableWrapper from '@/components/tableWrapper/TableWrapper';
import {organizationNavItems} from "@/components/shared/organizationNavItems";

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
        <Breadcrumb
          type="orgs"
          items={[
            {
              title: <Link href="/organizations">Organizations</Link>,
              key: "organizations"
            },
            {
              title: "Loading",
              copyText: "Loading",
              key: "org"
            },
          ]}
        />
        <TabNavigation items={navItems} pathname={""}></TabNavigation>
        <TableWrapper>
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
        </TableWrapper>
        </>
  );
}
