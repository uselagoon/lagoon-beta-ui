'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import BulkDeploymentColumns from '@/components/pages/bulkDeployments/TableColumns';
import { DataTable, SelectWithOptions, Skeleton } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <>
      <SectionWrapper>
        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 flex gap-2">
          <Skeleton className="w-[200px] h-10" />
        </h2>
        <DataTable
          loading
          columns={BulkDeploymentColumns}
          data={[]}
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
    </>
  );
}
