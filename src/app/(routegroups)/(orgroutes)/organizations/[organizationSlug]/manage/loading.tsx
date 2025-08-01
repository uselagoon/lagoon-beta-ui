'use client';

import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DataTable } from '@uselagoon/ui-library';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import { TabNavigation } from '@uselagoon/ui-library';
import { AddUser } from '@/components/pages/organizations/manage/_components/AddUser';

export default function Loading() {
  const navItems = organizationNavItems("loading");

  return (
    <>
    <OrgBreadcrumbs />
    <TabNavigation items={navItems} pathname={""}></TabNavigation>
    <SectionWrapper>
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Administration</h3>
      </div>
      <div className="gap-4 my-4">
        <AddUser
          orgId={0}
          refetch={() => {}}
          owners={[]}
        />
      </div>
      <DataTable
        columns={[]}
        data={[]}
      />
    </SectionWrapper>
    </>
  );
}
