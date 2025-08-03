'use client';

import React from 'react';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import GroupsDataTableColumns from '@/components/pages/organizations/groups/GroupsDataTableColumns';
import { DataTable, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Groups</h3>
      <div className="flex gap-4 items-center">
        <span className="inline-block my-4 mr-4">Create a new group</span>
        <Skeleton className="h-8 w-[100px]" />
      </div>

      <DataTable loading columns={GroupsDataTableColumns()} data={[]} />
    </SectionWrapper>
  );
}
