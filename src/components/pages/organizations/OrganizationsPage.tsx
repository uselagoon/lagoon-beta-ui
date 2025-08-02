'use client';

import { OrgType, OrgsData } from '@/app/(routegroups)/(orgroutes)/organizations/(organizations-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { OrganizationsTableColumns } from '@/components/pages/organizations/DataTableColumns';
import { orgGroupsAndProjectsQuery } from '@/lib/query/organizations/allOrganizationsQuery';
import { useQuery } from '@apollo/client';
import { Button, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function OrganizationsPage({ organizations }: { organizations: OrgsData['allOrganizations'] }) {
  const { data: extraOrgsData } = useQuery<OrgsData>(orgGroupsAndProjectsQuery);

  const [{ results, search }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };
  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  let orgs: OrgsData['allOrganizations'] = organizations.map(org => ({
    ...org,
    groups: null,
    projects: null,
  }));

  if (extraOrgsData) {
    const orgDataMap = extraOrgsData.allOrganizations.reduce((acc: Record<number, OrgType>, orgItem) => {
      acc[orgItem.id] = orgItem;
      return acc;
    }, {});

    const updatedOrgs = organizations.map(org => {
      const orgData = orgDataMap[org.id];

      if (orgData) {
        return {
          ...org,
          groups: orgData.groups,
          projects: orgData.projects,
        };
      }

      return org;
    });

    orgs = updatedOrgs;
  }

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organizations</h3>
        <Button className="px-0" variant="link">
          View all organizations
        </Button>
        <DataTable
          columns={OrganizationsTableColumns}
          data={orgs}
          searchableColumns={['name']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={results}
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
              value={String(results)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setResults(newVal);
              }}
            />
          )}
        />
      </SectionWrapper>
    </>
  );
}
