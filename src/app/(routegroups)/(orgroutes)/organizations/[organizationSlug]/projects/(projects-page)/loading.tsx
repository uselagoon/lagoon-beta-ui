'use client';

import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import { DataTable, SelectWithOptions, TabNavigation } from '@uselagoon/ui-library';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { ProjectsDataTableColumns } from '@/components/pages/organizations/projects/_components/ProjectsDataTableColumns';
import { resultsFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { OrgProject } from '../../(organization-overview)/page';
import { CreateProject } from '@/components/createProject/CreateProject';

export default function Loading() {
  const navItems = organizationNavItems("loading");

  return (
    <>
    <OrgBreadcrumbs />
    <TabNavigation items={navItems} pathname={""}></TabNavigation>
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
      <div className="gap-4 my-4">
        <CreateProject organizationId={0} options={[]} />
      </div>  
      <DataTable
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
