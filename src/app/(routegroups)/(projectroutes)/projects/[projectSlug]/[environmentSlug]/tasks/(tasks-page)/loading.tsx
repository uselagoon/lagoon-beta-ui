'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import getTasksTableColumns from '@/components/pages/tasks/_components/TableColumns';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';

export default function Loading() {
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Available Tasks</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        Run a task on this environment
      </span>

      <div className="mb-4" data-cy="task-select">
        <SelectWithOptions placeholder="Select a task to run" />
      </div>

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Recent Task Activity</h3>

      <DataTable
        loading
        columns={getTasksTableColumns('', 1, 1)}
        data={[]}
        renderFilters={() => (
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
          />
        )}
      />
    </SectionWrapper>
  );
}
