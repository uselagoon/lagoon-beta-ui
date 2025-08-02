'use client';

import { OrganizationManageData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/manage/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions, TabNavigation } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { resultsFilterValues } from '../groups/_components/groupFilterValues';
import { AddUser } from './_components/AddUser';
import { OrgOwner, createManageDataTableColumns } from './_components/ManageDataTableColumns';
import { typeOptions } from './_components/filterOptions';

export default function ManagePage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationManageData>;
  organizationSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }
  const [{ results, search, type }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    type: {
      defaultValue: undefined,
      parse: (value: string | undefined) => value as 'admin' | 'owner' | 'viewer',
    },
  });

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };
  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const getUserRole = (user: OrgOwner): string => {
    if (user.owner) return 'owner';
    if (user.admin) return 'admin';
    return 'viewer';
  };

  const filteredOwners = organization.owners.filter((owner: OrgOwner) => {
    const matchesSearch =
      !search ||
      (owner.firstName && owner.firstName.toLowerCase().includes(search.toLowerCase())) ||
      (owner.lastName && owner.lastName.toLowerCase().includes(search.toLowerCase())) ||
      owner.email.toLowerCase().includes(search.toLowerCase());

    const ownerRole = getUserRole(owner);
    const matchesType = !type || ownerRole === type;

    return matchesSearch && matchesType;
  });

  const columns = createManageDataTableColumns(organization.id, organization.name, organization.owners, refetch);

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Administration</h3>
        <div className="gap-4 my-4">
          <AddUser orgId={organization.id} refetch={refetch} owners={organization.owners} />
        </div>
        <DataTable
          columns={columns}
          data={filteredOwners}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={results || 10}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SelectWithOptions
                  options={[
                    { label: 'All Roles', value: 'all' },
                    ...typeOptions
                      .filter(o => o.value !== null)
                      .map(o => ({ label: o.label, value: o.value as string })),
                  ]}
                  width={120}
                  value={type || 'all'}
                  placeholder="All Roles"
                  onValueChange={value => {
                    if (value === 'all') {
                      setQuery({ type: undefined });
                    } else {
                      setQuery({ type: value as 'admin' | 'owner' | 'viewer' });
                    }
                  }}
                />
                <SelectWithOptions
                  options={resultsFilterValues.map(o => ({ label: o.label, value: o.value }))}
                  width={100}
                  value={String(results || 10)}
                  placeholder="Results per page"
                  onValueChange={value => setResults(value)}
                />
              </div>
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
