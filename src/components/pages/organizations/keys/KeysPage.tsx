'use client';

import React from 'react';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@/ui-library';
import { useQueryStates } from 'nuqs';

import KeysDataTableColumns from './KeysDataTableColumns';
import { CreateOrgKey } from '@/components/createOrgKey/CreateOrgKey';
import { OrganizationKeysData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';

export default function KeysPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationKeysData>;
  organizationSlug: string;
}) {
  const [{ results }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
  });

  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const { data: { organization } } = useReadQuery(queryRef);

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organization Keys</h3>
      <div className="gap-4 my-4">
        <CreateOrgKey organizationName={organization.name} />
      </div>
      <DataTable
        columns={KeysDataTableColumns(organizationSlug, organization.projects, organization.keys, refetch)}
        data={organization.keys}
        searchableColumns={['name']}
        initialPageSize={results || 10}
        renderFilters={table => (
          <div className="flex items-center gap-4">
            <SelectWithOptions
              options={[
                { label: '10 results per page', value: 10 },
                { label: '20 results per page', value: 20 },
                { label: '50 results per page', value: 50 },
              ]}
              width={100}
              value={String(results || 10)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setResults(newVal);
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
