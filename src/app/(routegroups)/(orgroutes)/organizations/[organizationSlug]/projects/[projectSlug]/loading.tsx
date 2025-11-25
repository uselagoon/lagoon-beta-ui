'use client';

import { Fragment } from 'react';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { notificationTypeOptions } from '@/components/pages/organizations/notifications/_components/filterOptions';
import { OrgProjectGroupColumns } from '@/components/pages/organizations/project/OrgProjectGroupColumns';
import { OrgProjectNotificationColumns } from '@/components/pages/organizations/project/OrgProjectNotificationColumns';
import { Checkbox, DataTable, SelectWithOptions, Skeleton } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ group_query, showDefaults, notification_query }, setQuery] = useQueryStates({
    group_results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },

    group_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    showDefaults: {
      defaultValue: false,
      parse: (value: string | undefined) => value === 'true',
      serialize: (value: boolean) => String(value),
    },
    notification_type: {
      defaultValue: undefined,
      parse: (value: string | undefined) => value as 'slack' | 'rocketChat' | 'email' | 'webhook' | 'teams',
    },
    notification_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setGroupQuery = (str: string) => {
    setQuery({ group_query: str });
  };

  const setNotificationQuery = (str: string) => {
    setQuery({ notification_query: str });
  };

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Groups for</h3>

      <Skeleton className="h-8 w-[100px]" />

      <DataTable
        loading
        columns={OrgProjectGroupColumns(
          _ => (
            <></>
          ),
          '',
          () => {}
        )}
        data={[]}
        searchableColumns={['name']}
        onSearch={searchStr => setGroupQuery(searchStr)}
        initialSearch={group_query}
        renderFilters={_ => (
          <div className="flex items-center justify-between">
            <Checkbox
              id="show-system-groups"
              label="Show system groups"
              checked={showDefaults}
              onCheckedChange={setShowDefaults}
            />
          </div>
        )}
      />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Notifications</h3>

      <Skeleton className="h-8 w-[100px]" />

      <DataTable
        loading
        columns={OrgProjectNotificationColumns(_ => (
          <Fragment> </Fragment>
        ))}
        data={[]}
        searchableColumns={['name']}
        onSearch={searchStr => setNotificationQuery(searchStr)}
        initialSearch={notification_query}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <SelectWithOptions
              options={notificationTypeOptions}
              placeholder="Filter by type"
              onValueChange={newVal => {
                const typeColumn = table.getColumn('type');
                setQuery({ notification_type: newVal as any });
                if (typeColumn && newVal != 'all') {
                  typeColumn.setFilterValue(newVal);
                } else {
                  typeColumn?.setFilterValue(undefined);
                }
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
