'use client';

import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DataTable } from '@uselagoon/ui-library';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import { TabNavigation } from '@uselagoon/ui-library';
import { AddNotification } from '@/components/pages/organizations/notifications/_components/AddNotification';

export default function Loading() {
  const navItems = organizationNavItems("loading");

  return (
    <>
    <OrgBreadcrumbs />
    <TabNavigation items={navItems} pathname={""}></TabNavigation>
    <SectionWrapper>
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notifications</h3>
      </div>
      <div className="gap-4 my-4">
        <AddNotification
          orgId={0}
          refetch={() => {}}
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
