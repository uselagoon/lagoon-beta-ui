'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddUser } from '@/components/pages/organizations/manage/_components/AddUser';
import { manageTableLoadingCols } from '@/components/pages/organizations/manage/_components/ManageDataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <>
      <SectionWrapper>
        <div className="flex items-center justify-between mb-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Administration</h3>
        </div>
        <div className="gap-4 my-4">
          <AddUser orgId={0} refetch={() => {}} owners={[]} />
        </div>
        <DataTable loading columns={manageTableLoadingCols} data={[]} />
      </SectionWrapper>
    </>
  );
}
