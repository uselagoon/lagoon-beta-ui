'use client';

import React from 'react';

import { OrganizationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddUser } from '@/components/addUserToOrg/Adduser';
import { CreateGroup } from '@/components/createGroup/CreateGroup';
import { CreateProject } from '@/components/createProject/CreateProject';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DetailStat } from '@uselagoon/ui-library';

import { Description } from './_components/Description';

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

  const groupCount = Object.values(organization.groups).filter(group => group.type !== 'project-default-group').length;

  const totalNotificationCount = ['slacks', 'rocketchats', 'webhook', 'teams', 'emails'].reduce(
    (acc, key) => acc + (organization[key as Notification] ? organization[key as Notification].length : 0),
    0
  );

  const orgDetailedItems = [
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
    ...(organization.deployTargets
      ? [
          {
            key: 'deploy_targets',
            label: 'AVAILABLE DEPLOY TARGETS',
            children: (
              <div className="space-y-0.5">
                {organization.deployTargets.slice(0, 3).map(target => (
                  <div key={target.id} className="text-sm">
                    {target.name}
                  </div>
                ))}
                {organization.deployTargets.length >= 4 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {organization.deployTargets.length - 3} more
                  </div>
                )}
              </div>
            ),
            lowercaseValue: true,
          },
        ]
      : []),
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
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Overview</h3>

        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          Key information about your organization
        </span>

        <Description
          orgId={organization.id}
          name={organization.friendlyName || organization.name}
          description={organization.description}
        />

        <div className="flex flex-col gap-4 my-10">
          <CreateProject organizationId={organization.id} options={deployTargetOptions} />
          <CreateGroup organizationId={organization.id} existingGroupNames={existingGroupNames} />
          <AddUser groupOptions={groupSelectOptions} type="multiple" />
        </div>

        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(370px,1fr))] [&>div[data-slot=card]]:w-full [&>div[data-slot=card]]:max-w-full [&>div[data-slot=card]]:min-w-[370px]">
          {orgDetailedItems.map(item => (
            <DetailStat
              title={item.label}
              value={item.children}
              lowercaseValue={item.lowercaseValue}
              key={item.key}
              capitalizeValue={item.capitalizeValue}
            />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
