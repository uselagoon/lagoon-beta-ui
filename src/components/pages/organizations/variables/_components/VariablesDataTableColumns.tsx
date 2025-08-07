'use client';

import { OrgEnvVariable } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef } from '@uselagoon/ui-library';

export const VariablesDataTableColumnsNoValues: DataTableColumnDef<OrgEnvVariable>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'scope',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Scope
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },
];

export const VariablesDataTableColumns = (
  editVariableModal: (variable: OrgEnvVariable) => React.ReactNode,
  deleteVariableModal: (variable: OrgEnvVariable) => React.ReactNode
): DataTableColumnDef<OrgEnvVariable>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'scope',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Scope
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => {
      return <span>{row.original.value}</span>;
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right mr-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          {editVariableModal(row.original)}
          {deleteVariableModal(row.original)}
        </div>
      );
    },
  },
];
