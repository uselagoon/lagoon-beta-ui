'use client';


import { handleSort, renderSortIcons } from '@/components/utils';
import {Button, DataTableColumnDef, Badge} from '@uselagoon/ui-library';
import {CircleAlert, CircleCheck} from 'lucide-react';
import {Route} from "@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page";

export const RoutesDataTableColumns: DataTableColumnDef<Route>[] = [
	{
		accessorKey: 'primary',
		header: 'Type',
		cell: ({ row }) => {
			const { primary } = row.original;
			// Need to check what field is determining 'type' here
			// Adding Primary as a placeholder
			return (
				<Badge>{primary}</Badge>
			);
		},
	},
	{
		accessorKey: 'domain',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
					Domain
					<div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
				</Button>
			);
		},
		cell: ({ row }) => {
			const { domain } = row.original;
			return <div className="ml-6">{domain}</div>;
		},
	},
	{
		accessorFn: (row) => row.environment?.name,
		id: 'environment',
		header: 'Attached to',
		cell: ({ row }) => {
			const { environment } = row.original;
			return <div className="ml-6">{environment?.name}</div>;
		},
	},
	{
		accessorKey: 'verification',
		header: 'Verification',
		cell: ({ row }) => {
			// Placeholder logic for verification status
			const { verified } = row.original;
			const verificationStatus = verified.includes('new') ? <Badge variant="danger"><CircleAlert /></Badge> : <Badge variant="success"><CircleCheck /></Badge>;
			return (
				<div className="ml-6">
					{verificationStatus}
				</div>
			)
		},
	},
	{
		id: 'actions',
		header: () => <div className="text-right mr-4">Actions</div>,
		cell: ({ row }) => {
			return (
				// TODO
				<div className="flex gap-4 justify-end items-center">

				</div>
			);
		},
	},
];
