'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { PendingChangesTableColumns } from '@/components/pages/pendingChanges/DataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Pending Changes</h3>
      <DataTable loading columns={PendingChangesTableColumns} data={[]} />
    </SectionWrapper>
  );
}
