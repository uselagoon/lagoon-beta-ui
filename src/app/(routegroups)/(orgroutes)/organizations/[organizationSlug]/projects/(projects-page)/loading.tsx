'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { CreateProject } from '@/components/createProject/CreateProject';
import { resultsFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { ProjectsDataTableColumns } from '@/components/pages/organizations/projects/_components/ProjectsDataTableColumns';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';

import { OrgProject } from '../../(organization-overview)/page';

export default function Loading() {
  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
        <div className="gap-4 my-4">
          <CreateProject organizationId={0} options={[]} />
        </div>
        <DataTable
          loading
          columns={ProjectsDataTableColumns((project: OrgProject) => null)}
          data={[]}
          searchableColumns={['name']}
          initialPageSize={10}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <SelectWithOptions
                options={resultsFilterValues.map(o => ({ label: o.label, value: o.value }))}
                width={100}
                value={String(10)}
                placeholder="Results per page"
              />
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
