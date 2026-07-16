import { Meta, StoryObj } from '@storybook/react';
import { Story } from '@storybook/addon-docs/blocks';

import { default as DataTable } from '../components/DataTable';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import SelectWithOptions from '../components/Select';

const meta: Meta<typeof DataTable> = {
	component: DataTable,
	title: 'ui-library/DataTable',
	tags: ['autodocs'],
};

type Story = StoryObj<typeof DataTable>;

const tableData = [
	{
		id: 1,
		amount: 100,
		status: 'rejected',
		email: 'someone@email.com',
	},
	{
		id: 2,
		amount: 250,
		status: 'processing',
		email: 'another@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
		extraInfo: {
			name: 'extra information',
		},
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 100000,
		status: 'completed',
		email: 'someoneelse@email.com',
	},
	{
		id: 3,
		amount: 500,
		status: 'someverybigstatusthatisstillunclear',
		email: 'someoneelse@email.com',
	},
];

const tableColumns = [
	{
		accessorKey: 'status',
		width: '20%',
		header: ({ column }) => {
			const sortDirection = column.getIsSorted();
			return (
				<Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Status
					<div className="ml-1 flex flex-col">
						<ChevronUp
							className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')}
						/>
						<ChevronDown
							className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')}
						/>
					</div>
				</Button>
			);
		},
	},
	{
		accessorKey: 'email',
		header: 'Email',
		width: '30%',
	},
	{
		accessorKey: 'amount',
		header: 'Amount',
		width: '30%',
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue('amount'));
			const formatted = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: 'USD',
			}).format(amount);

			return <div className="text-1xl font-medium text-green-300">{formatted}</div>;
		},
	},
	{
		id: 'something_else',
		header: 'Extra',
		width: '30%',
		// used for searching without accessorKey
		accessorFn: (row) => row.extraInfo?.name ?? '',
		cell: ({ row }) => {
			const entry = row.original;
			return (
				<div>
					<a className="hover:text-blue-800 transition-colors" href={``}>
						{entry.extraInfo?.name}
					</a>
				</div>
			);
		},
	},
	{
		id: 'actions',
		header: 'Actions',
		width: '20%',
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" sideOffset={4} className="z-[9999] bg-white border">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
							Copy payment ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];

export const Default: Story = {
	args: {
		columns: tableColumns,
		data: tableData,
		// disableExtra: true,
		// searchableColumns: ['email', 'status'],
		searchableColumns: ['something_else'],
		// searchPlaceholder: 'Enter something to search',
		// initialSearch: ''
		// loading: true,
		// loading: true,
		onRowClick: (row) => {
			console.warn(row.original);
		},
		renderFilters: (table) => {
			return (
				<>
					<SelectWithOptions
						options={[
							{
								label: '10 results per page',
								value: 10,
							},
							{
								label: '20 results per page',
								value: 20,
							},
							{
								label: '50 results per page',
								value: 50,
							},
						]}
						width={100}
						placeholder="Results per page"
						onValueChange={(newVal) => {
							table.setPageSize(Number(newVal));
						}}
					/>
				</>
			);
		},
	},
};

export default meta;
