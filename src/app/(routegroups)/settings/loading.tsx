'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { renderSshColumnsNoActions } from '@/components/pages/settings/DataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">SSH Keys</h3>
      <DataTable loading columns={renderSshColumnsNoActions()} data={[]} />
    </SectionWrapper>
  );
}
