'use client';

import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {

  return (
    <>
    <OrgBreadcrumbs />
    <SectionWrapper>
      <div className="flex items-center justify-between mb-4">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notifications</h3>
      </div>
      <DataTable
        columns={[]}
        data={[]}
      />
    </SectionWrapper>
    </>
  );
}
