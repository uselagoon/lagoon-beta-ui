'use client';

import { BulkDeployment } from '@/app/(routegroups)/bulkdeployment/[bulkId]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { CopyToClipboard, DataTable, SelectWithOptions } from '@uselagoon/ui-library';

import BulkDeploymentColumns from './TableColumns';

export default function BulkDeploymentsPage({ bulkDeployments }: { bulkDeployments: BulkDeployment[] }) {
  const bulkName = bulkDeployments[0].bulkName;
  return (
    <SectionWrapper>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 flex gap-2">
        {bulkName}
        <CopyToClipboard text={bulkName} iconOnly />
      </h2>
      <DataTable
        columns={BulkDeploymentColumns}
        data={bulkDeployments}
        searchableColumns={['project_name', 'environment_name', 'deployment_name']}
        renderFilters={table => (
          <SelectWithOptions
            options={[
              {
                label: '10 results per page',
                value: 10,
              },
              {
                label: '20 results per page',
                value: 20,
              },
              {
                label: '50 results per page',
                value: 50,
              },
            ]}
            width={100}
            placeholder="Results per page"
            onValueChange={newVal => {
              table.setPageSize(Number(newVal));
            }}
          />
        )}
      />
    </SectionWrapper>
  );
}
