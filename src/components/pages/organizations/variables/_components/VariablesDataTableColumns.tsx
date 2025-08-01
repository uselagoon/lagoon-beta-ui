'use client';

import { OrgEnvVariable } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import { Button, DataTableColumnDef, cn } from '@uselagoon/ui-library';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
          <div className="flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
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
          <div className="flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
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
    header: () => <div className="text-right">Actions</div>,
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
