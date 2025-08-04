'use client';

import { OrgEnvVariable } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, cn } from '@uselagoon/ui-library';

export const VariablesDataTableColumns = (
  editVariableModal: (variable: OrgEnvVariable) => React.ReactNode,
  deleteVariableModal: (variable: OrgEnvVariable) => React.ReactNode,
  showValues: boolean
): DataTableColumnDef<OrgEnvVariable>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
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
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
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
      return showValues ? <span>{row.original.value}</span> : <span>●●●●●●●●</span>;
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
