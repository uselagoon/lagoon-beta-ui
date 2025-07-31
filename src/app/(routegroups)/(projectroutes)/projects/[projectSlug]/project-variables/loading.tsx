'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { ProjectEnvVarsPartialColumns } from '@/components/pages/projectVariables/_components/DataTableColumns';
import { Button, DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
      <Button data-testId="var-visibility-toggle" size="sm" className="max-w-max mb-4" disabled>
        Show values
      </Button>

      <DataTable loading columns={ProjectEnvVarsPartialColumns()} data={[]} disableExtra />
    </SectionWrapper>
  );
}
