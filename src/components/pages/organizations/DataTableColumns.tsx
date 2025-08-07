'use client';

import Link from 'next/link';

import { OrgType } from '@/app/(routegroups)/(orgroutes)/organizations/(organizations-page)/page';
import { renderSortIcons } from '@/components/utils';
import { Button, Checkbox, DataTableColumnDef, Skeleton } from '@uselagoon/ui-library';

type SortDirection = 'asc' | 'desc' | false;

type Column = {
  toggleSorting: (desc: boolean) => void;
  clearSorting: () => void;
};

export const handleSort = (sortDirection: SortDirection, column: Column) => {
  if (sortDirection === false) {
    column.toggleSorting(false);
  } else if (sortDirection === 'asc') {
    column.toggleSorting(true);
  } else {
    column.clearSorting();
  }
};

export const fieldCount = (
  field: OrgType['groups'] | OrgType['projects'],
  quota: OrgType['quotaProject'],
  fieldType: string
) => {
  let count = field?.length ?? <Skeleton className="w-[20] h-5" />;
  let fieldQuota = quota >= 0 ? quota : 'Unlimited';
  let pluralizedFieldType = quota > 1 || quota === -1 ? `${fieldType}s` : fieldType;
  return (
    <div className="flex gap-1">
      {count} of {fieldQuota} {pluralizedFieldType}
    </div>
  );
};

export const OrganizationsTableColumns: DataTableColumnDef<OrgType>[] = [
  {
    accessorKey: 'name',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Organization
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },

    cell: ({ row }) => {
      const organizationName = row.original.name;
      return (
        <div className="max-w-[25vw]">
          <Link className="hover:text-blue-800 transition-colors" href={`/organizations/${organizationName}`}>
            {organizationName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'groups',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          No. of Groups
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const filteredGroups = (row.original.groups ?? []).filter((group: { type: string }) => group.type !== 'project-default-group');
      const groupQuota = row.original.quotaGroup;

      return <div className="max-w-[25vw]">{fieldCount(filteredGroups, groupQuota, 'group')}</div>;
    },
  },
  {
    accessorKey: 'projects',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          No. of Projects
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const projects = row.original.projects;
      const projectQuota = row.original.quotaProject;

      return <div className="max-w-[25vw]">{fieldCount(projects, projectQuota, 'project')}</div>;
    },
  },
  {
    accessorKey: 'deployTargets',
    header: 'Targets',
    cell: ({ row }) => {
      const deployTargets = row.original.deployTargets;
      return (
        <div className="max-w-[25vw]">
          {deployTargets.map(target => (
            <div key={target.name}>{target.name}</div>
          ))}
        </div>
      );
    },
  },
];

export const OrganizationsTableColumnsWithCheckbox: DataTableColumnDef<OrgType>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        label={''}
        id=""
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={value => row.toggleSelected(!!value)}
        aria-label="Select row"
        label={''}
        id={row.id}
      />
    ),
    size: 10,
  },
  ...OrganizationsTableColumns,
];

export default OrganizationsTableColumnsWithCheckbox;
