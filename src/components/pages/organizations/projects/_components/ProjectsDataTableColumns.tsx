'use client';

import Link from 'next/link';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { CloneProject } from '@/components/cloneProject/CloneProject';
import { handleSort, renderSortIcons } from '@/components/utils';
import { useCloneStatus } from '@/hooks/useCloneStatus';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@/ui-library';
import { FolderCog } from 'lucide-react';

const ProjectNameCell = ({ name, orgName }: { name: string; orgName: string }) => {
  const { isCloning } = useCloneStatus(name);
  return (
    <div className="flex items-center gap-2">
      <Link className="hover:text-blue-800 transition-colors" href={`/organizations/${orgName}/projects/${name}`}>
        {name}
      </Link>
      {isCloning && <Badge variant="info">Cloning</Badge>}
    </div>
  );
};

export const ProjectsDataTableColumns = (
  deleteProjectModal: (project: OrgProject) => React.ReactNode,
  orgName: string,
  refetch?: () => void
): DataTableColumnDef<OrgProject>[] => [
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
    cell: ({ row }) => <ProjectNameCell name={row.original.name} orgName={orgName} />,
  },
  {
    accessorKey: 'groupCount',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Group count
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const groupCount = row.original.groupCount;
      return <div className="ml-6">{groupCount || 0}</div>;
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right mr-4">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-4 justify-end items-center">
          <Tooltip>
            <TooltipTrigger>
              <CloneProject projectName={row.original.name} organizationSlug={orgName} refetch={refetch} />
            </TooltipTrigger>
            <TooltipContent>Clone this Project</TooltipContent>
          </Tooltip>
          <Button>
            <Link target="_blank" href={`/projects/${row.original.name}`}>
              <Tooltip>
                <TooltipTrigger>
                  <FolderCog className="h-6 w-6 mt-1" />
                </TooltipTrigger>
                <TooltipContent>View Project Dashboard</TooltipContent>
              </Tooltip>
            </Link>
          </Button>
          {deleteProjectModal(row.original)}
        </div>
      );
    },
  },
];
