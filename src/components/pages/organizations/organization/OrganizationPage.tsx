'use client';

import { OrganizationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { AddUser } from '@/components/addUserToOrg/Adduser';
import { CreateGroup } from '@/components/createGroup/CreateGroup';
import { CreateProject } from '@/components/createProject/CreateProject';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import {DetailStat, TabNavigation} from '@uselagoon/ui-library';
import { usePathname, useRouter } from 'next/navigation';
import { Description } from './_components/Description';
import SectionWrapper from "@/components/SectionWrapper/SectionWrapper";
import React from "react";
import {organizationNavItems} from '../../../shared/organizationNavItems';
import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';

type Notification = 'slacks' | 'rocketchats' | 'webhook' | 'teams' | 'emails';
export default function OrganizationPage({
  queryRef,
  orgSlug,
}: {
  queryRef: QueryRef<OrganizationData>;
  orgSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  if (!organization) {
    return <OrganizationNotFound orgName={orgSlug} />;
  }
  const path = usePathname();
  const router = useRouter();
  const navItems = organizationNavItems(orgSlug);
  const groupCount = Object.values(organization.groups).filter(group => group.type !== 'project-default-group').length;

  const totalNotificationCount = ['slacks', 'rocketchats', 'webhook', 'teams', 'emails'].reduce(
    (acc, key) => acc + (organization[key as Notification] ? organization[key as Notification].length : 0),
    0
  );

  const orgDetailedItems = [
    {
      key: 'org_id',
      label: 'ORG ID',
      children: organization.id,
    },
    {
      key: 'org_name',
      label: 'ORG NAME',
      children: organization.name,
      lowercaseValue: true,
    },
    {
      key: 'groups',
      label: 'GROUPS',
      children: (
        <>
          Group quota: {groupCount} of {organization.quotaGroup === -1 ? 'unlimited' : organization.quotaGroup}
        </>
      ),
      capitalizeValue: true,
    },
    {
      key: 'projects',
      label: 'PROJECTS',
      children: (
        <>
          Project quota: {organization.projects.length} of{' '}
          {organization.quotaProject === -1 ? 'unlimited' : organization.quotaProject}
        </>
      ),
      capitalizeValue: true,
    },
    {
      key: 'notifications',
      label: 'NOTIFICATIONS',
      children: (
        <>
          Notification quota: {totalNotificationCount} of{' '}
          {organization.quotaNotification === -1 ? 'unlimited' : organization.quotaNotification}
        </>
      ),
      capitalizeValue: true,
    },
    {
      key: 'environments',
      label: 'ENVIRONMENTS',
      children: (
        <>
          Environment quota: {organization.environments.length} of{' '}
          {organization.quotaEnvironment === -1 ? 'unlimited' : organization.quotaEnvironment}
        </>
      ),
      capitalizeValue: true,
    },
      ...(organization.deployTargets ? [{
          key: 'deploy_targets',
          label: 'AVAILABLE DEPLOY TARGETS',
          children: (
              <div className="space-y-0.5">
                  {organization.deployTargets.slice(0, 3).map(target => (
                      <div key={target.id} className="text-sm text-center">
                          {target.name}
                      </div>
                  ))}
                  {organization.deployTargets.length >= 4 && (
                      <div className="text-sm text-center text-muted-foreground">
                          ... and {organization.deployTargets.length - 3} more
                      </div>
                  )}
              </div>
          ),
          lowercaseValue: true,
      }] : []),
  ];

  const deployTargetOptions = organization.deployTargets.map(deploytarget => {
    return { label: deploytarget.name, value: deploytarget.id };
  });
  const existingGroupNames = organization.groups.map(g => g.name);

  const groupSelectOptions = organization.groups.map(group => {
    return { value: group.name, label: group.name };
  });

  return (
    <>
      <OrgBreadcrumbs />
      <TabNavigation items={navItems} pathname={path} onTabNav={(key) => router.push(`${key}`)}></TabNavigation>
      <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>
      <p>Key information about your organization</p>
      <Description
        orgId={organization.id}
        name={organization.friendlyName || organization.name}
        description={organization.description}
      />

      <div className="flex flex-wrap flex-col gap-4 mb-4">
        <CreateProject organizationId={organization.id} options={deployTargetOptions} />
        <CreateGroup organizationId={organization.id} existingGroupNames={existingGroupNames} />
        <AddUser groupOptions={groupSelectOptions} type="multiple" />
      </div>

      <div className="flex flex-wrap justify-between max-w-7xl mx-auto gap-y-4 text-center">
        {orgDetailedItems.map((item) => (
            <DetailStat title={item.label} value={item.children} lowercaseValue={item.lowercaseValue} key={item.key} capitalizeValue={item.capitalizeValue}  />
        ))}
      </div>
      </SectionWrapper>
    </>
  );
}
