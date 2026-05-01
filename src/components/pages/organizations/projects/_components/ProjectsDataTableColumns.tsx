'use client';

import Link from 'next/link';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { CloneProject } from '@/components/cloneProject/CloneProject';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@/ui-library';
import { FolderCog } from 'lucide-react';

const setCloneBadge = (status?: string) => {
  if (!status) return null;
  if (status === 'FAILED' || status === 'CANCELLED') {
    return <Badge variant="destructive">Clone Failed</Badge>;
  } else if (status != "COMPLETE") {
    return <Badge variant="info">Cloning</Badge>;
  } else {
    return <Badge variant="success">Clone</Badge>;
  }
}

const validateCloneRepo = (gitUrl: string) => {
  if (gitUrl.startsWith('git@') || gitUrl.startsWith('ssh://')) {
    return false;
  }

  try {
    const url = new URL(gitUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

export const ProjectsDataTableColumns = (
  deleteProjectModal: (project: OrgProject) => React.ReactNode,
  orgName: string,
  projectCloneEnabled: boolean,
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
    cell: ({ row }) => {
      const { name, clone } = row.original;

      return (
        <div className="flex items-center gap-2">
          <Link className="hover:text-blue-800 transition-colors" href={`/organizations/${orgName}/projects/${name}`}>
            {name}
          </Link>
          {setCloneBadge(clone?.status)}
        </div>
      );
    },
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
          {projectCloneEnabled && (
            <Tooltip>
              <TooltipTrigger>
                <CloneProject projectName={row.original.name} organizationSlug={orgName} refetch={refetch} disabled={!validateCloneRepo(row.original.gitUrl || '')} />
              </TooltipTrigger>
              <TooltipContent>{!validateCloneRepo(row.original.gitUrl || '') ? 'Private repository: not eligible for cloning' : 'Clone this Project'}</TooltipContent>
            </Tooltip>
          )}
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
