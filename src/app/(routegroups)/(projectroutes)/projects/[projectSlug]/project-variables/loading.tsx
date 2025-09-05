'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { ProjectEnvVarsPartialColumns } from '@/components/pages/projectVariables/_components/DataTableColumns';
import {DataTable, Switch} from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <div className="flex gap-2 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
        <Switch
          label="Edit values"
          id=""
          description=""
        />
      </div>

      <DataTable loading columns={ProjectEnvVarsPartialColumns()} data={[]} disableExtra />
    </SectionWrapper>
  );
}
