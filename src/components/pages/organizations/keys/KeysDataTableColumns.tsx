'use client';

import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, CopyToClipboard, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger } from '@/ui-library';
import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { OrganizationKey } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';
import { AddOrganizationKeyToProject } from '@/components/addOrgKeyToProject/AddOrgKeyToProject';
import { DeleteKey } from './_components/DeleteKey';
import { RemoveKeyFromProject } from './_components/RemoveKeyFromProject';
import { UpdateKey } from './_components/UpdateKey';

export const KeysDataTableColumns = (
  organizationSlug?: string,
  projects?: OrgProject[],
  keys?: OrganizationKey[],
  refetch?: () => void
): DataTableColumnDef<OrganizationKey>[] => {
  const assignedProjects = new Set(
    (keys ?? []).flatMap(key => (key.projects ?? []).map(proj => proj.name))
  );

  const availableProjects = (projects ?? []).filter(proj => !assignedProjects.has(proj.name));

  return [
    {
      accessorKey: 'name',
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;
        return a.localeCompare(b);
      },
      width: '20%',
      header: ({ column }) => {
        const sortDirection = column.getIsSorted();

        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Key Name
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const { name } = row.original;

        return (
          <div className="max-w-[25vw] flex gap-4">
            {name}
          </div>
        );
      },
    },
    {
      accessorKey: 'created',
      sortingFn: (rowA, rowB, columnId) => {
        const a = (rowA.getValue(columnId) as number) || 0;
        const b = (rowB.getValue(columnId) as number) || 0;
        return a - b;
      },
      width: '15%',
      header: ({ column }) => {
        const sortDirection = column.getIsSorted();

        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Created
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const created = row.original.created ?? 0;
        return <div className="max-w-[25vw]">{created}</div>;
      },
    },
    {
      accessorKey: 'comment',
      width: '25%',
      header: 'Comment',
      cell: ({ row }) => {
        const comment = row.original.comment ?? '';
        return <div className="max-w-[25vw]">{comment}</div>;
      },
    },
    {
      accessorKey: 'publicKey',
      width: '20%',
      header: 'Public Key',
      cell: ({ row }) => {
        const publicKey = row.original.publicKey ?? '';
        return (
          <div className="max-w-[20vw]">
            {publicKey ? <CopyToClipboard withToolTip text={publicKey} type="hiddenWithIcon" /> : ''}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      width: '20%',
      cell: ({ row }) => {
        const orgKey = row.original;
        const noAvailableProjects = availableProjects.length === 0;
        const notAssignedToProject = !orgKey.projects || orgKey.projects.length === 0;

        return (
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <AddOrganizationKeyToProject
                    keyId={orgKey.id}
                    keyName={orgKey.name}
                    projects={availableProjects}
                    disabled={noAvailableProjects}
                    refetch={refetch}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {noAvailableProjects ? 'All projects already have an org key' : 'Add Key to a Project'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <RemoveKeyFromProject orgKey={orgKey} refetch={refetch!} />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {notAssignedToProject ? 'Key is not assigned to any project' : 'Remove Key from Project'}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <UpdateKey orgKey={orgKey} refetch={refetch!} />
                </span>
              </TooltipTrigger>
              <TooltipContent>Update Key</TooltipContent>
            </Tooltip>
            <DeleteKey orgKey={orgKey} refetch={refetch!} />
          </div>
        );
      },
    },
  ];
};

export default KeysDataTableColumns;
