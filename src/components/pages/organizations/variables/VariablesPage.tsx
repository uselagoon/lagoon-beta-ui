'use client';

import React, { useCallback, useState } from 'react';

import {
  OrgEnvVariable,
  OrganizationVariablesData,
} from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddNewVariable } from '@/components/addNewVariable/AddNewVariable';
import { DeleteVariableDialog } from '@/components/deleteVariable/DeleteVariableModal';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import organizationByNameWithEnvVarsValue from '@/lib/query/organizations/organizationByNameWithEnvVarsValue';
import { QueryRef, useLazyQuery, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import {DataTable, SelectWithOptions, Switch} from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

import { EditVariable } from '../../projectVariables/_components/EditVariable';
import { VariablesDataTableColumns, VariablesDataTableColumnsNoValues } from './_components/VariablesDataTableColumns';
import { resultsFilterValues, scopeOptions } from './_components/filterValues';

export default function OrgVariablesPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationVariablesData>;
  organizationSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const [envAction, setEnvAction] = useState('');
  const [orgValuesVisible, setOrgValuesVisible] = useState(false);
  const [isPaginationDisabled, setIsPaginationDisabled] = React.useState(false);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  const [{ results, search, scope }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    scope: {
      defaultValue: undefined,
      parse: (value: string | undefined) => value as OrgEnvVariable['scope'],
    },
  });

  const [getOrgEnvVarValues, { loading: orgLoading, data: orgEnvValues }] = useLazyQuery(
    organizationByNameWithEnvVarsValue,
    {
      variables: { name: organization?.name },
      onError: err => {
        console.error(err);
        toast.error('Unauthorized', {
          description: `You don't have permission to ${envAction} organization ${
            envAction === 'view' ? ' variable values' : 'variables'
          }. Contact your administrator to obtain the relevant permissions.`,
          id: 'unauthorized_error',
        });
      },
      onCompleted: () => setOrgValuesVisible(true),
    }
  );
  const permissionCheck = async (action: 'add' | 'delete' | 'view') => {
    setEnvAction(action);
    return await getOrgEnvVarValues();
  };

  const stableViewPermissionCheck = useCallback(() => permissionCheck('view'), [permissionCheck]);

  const stableAddPermissionCheck = useCallback(() => permissionCheck('add'), [permissionCheck]);

  const stableDeletePermissionCheck = useCallback(() => permissionCheck('delete'), [permissionCheck]);

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  const setSearch = (val: string) => {
    setQuery({ search: val });
  };

  const setScope = (val: OrgEnvVariable['scope']) => {
    setQuery({ scope: val });
  };

  const variables = organization.envVariables;

  const handleShowEnvVars = async () => {
    await stableViewPermissionCheck();

    if (orgValuesVisible) {
      setOrgValuesVisible(false);
      return;
    }

    await getOrgEnvVarValues();
  };

  const allVars = orgEnvValues?.organization?.envVariables || (variables as unknown as OrgEnvVariable[]);
  const filteredVariables = scope ? allVars.filter((v: OrgEnvVariable) => v.scope === scope) : allVars;

  const renderOrgVarsWithValues =
    !orgLoading && orgEnvValues?.organization?.envVariables && orgValuesVisible ? true : false;

  const orgVariablesColumns = renderOrgVarsWithValues
    ? VariablesDataTableColumns(
        currentVariable => (
          <EditVariable type="organization" orgName={organizationSlug} currentEnv={currentVariable} refetch={refetch} />
        ),
        currentVariable => (
          <DeleteVariableDialog
            type="organization"
            orgName={organizationSlug}
            onClick={() => stableDeletePermissionCheck}
            currentEnv={currentVariable}
            refetch={refetch}
          />
        )
      )
    : VariablesDataTableColumnsNoValues;

  return (
    <>
      <SectionWrapper>
        <div className="flex items-start justify-between">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organization variables</h3>
          <Switch
            data-testId="var-visibility-toggle"
            label="Edit values"
            disabled={orgLoading}
            loading={orgLoading}
            checked={orgValuesVisible}
            id=""
            description=""
            onCheckedChange={handleShowEnvVars}
          />
        </div>

        <DataTable
          columns={orgVariablesColumns}
          data={filteredVariables}
          searchableColumns={['name']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={results || 10}
          disablePagination={isPaginationDisabled}
          renderFilters={table => (
            <div className="flex gap-2">
              <SelectWithOptions
                options={scopeOptions.filter(o => o.value !== null) as { label: string; value: string }[]}
                value={scope || ''}
                placeholder="Filter by scope"
                onValueChange={newVal => {
                  table.getColumn('scope')?.setFilterValue(newVal);
                  setScope(newVal as OrgEnvVariable['scope']);
                }}
              />

              <SelectWithOptions
                options={resultsFilterValues}
                width={100}
                value={isPaginationDisabled ? 'all' : String(results ?? 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  const size = newVal === 'all' ? table.getRowCount() : Number(newVal);
                  setIsPaginationDisabled(newVal === 'all');
                  table.setPageSize(size);
                  setQuery({ results: size });
                }}
              />
            </div>
          )}
        />
        <div className="flex justify-end mt-4">
          <AddNewVariable
            onClick={() => stableAddPermissionCheck}
            type="organization"
            orgName={organizationSlug}
            refetch={refetch}
          />
        </div>
      </SectionWrapper>
    </>
  );
}
