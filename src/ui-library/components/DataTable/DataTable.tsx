'use client';
import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { Button } from '@ui-lib/components/ui/button';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
	VisibilityState,
	FilterFnOption,
	Cell,
	Table as TableType,
	Row,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { DebouncedInput } from '../Input';

import { highlightTextInElement } from './HighlightText';
import { cn } from '@ui-lib/lib/utils';
import { Skeleton } from '../ui/skeleton';
import SelectWithOptions from '../Select';

type LibColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
	width?: string;
};
export interface DataTableProps<TData, TValue> {
	columns: LibColumnDef<TData, TValue>[];
	data: TData[];
	/** Either accessorKeys, or ids from the column definition */
	searchableColumns?: string[];
	searchPlaceholder?: string;
	loading?: boolean;
	/** Pass in custom filters - datatime/pagination/status dropdowns etc */
	renderFilters?: (table: TableType<TData>) => ReactNode;
	/** Do not render the top filter section, nor the bottom pagination section */
	disableExtra?: boolean;
	disablePagination?: boolean;
	onSearch?: (searchString: string) => void;
	initialSearch?: string;
	initialPageSize?: number;
	/** Called on each row (empty space) click - ignored if cell item is clicked */
	onRowClick?: (row: Row<TData>) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchableColumns,
  searchPlaceholder,
  onSearch,
  loading,
  renderFilters,
  disableExtra,
  disablePagination,
  initialSearch,
  initialPageSize,
  onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);

	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

	const [globalFilter, setGlobalFilter] = React.useState<string>(initialSearch ?? '');

	// auto-focus if search was filled during loading state
	const searchInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (initialSearch && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, []);

	const customGlobalFilter = (row: any, columnId: string, value: string) => {
		// globally search everything if searchableCols isnt provided
		if (searchableColumns?.length === 0) {
			return String(row.getValue(columnId)).toLowerCase().includes(value.toLowerCase());
		}
		return searchableColumns?.some((colId) => {
			const cellValue = row.getValue(colId);
			return String(cellValue).toLowerCase().includes(value.toLowerCase());
		});
	};

	const renderCellWithHighlight = (cell: Cell<TData, unknown>) => {
		const cellValue = cell.getValue();

		const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());

		if (cellValue && globalFilter) {
			const shouldHighlight = !searchableColumns?.length || searchableColumns?.includes(cell.column.id);

			if (shouldHighlight && typeof cell.column.columnDef.cell === 'function') {
				return highlightTextInElement(
					cell?.column?.columnDef?.cell(cell.getContext()),
					globalFilter,
					cellValue as string,
				);
			}
		}

		return rendered;
	};

	// loading state skeletons
	const tableData = React.useMemo(() => (loading ? Array(10).fill({}) : data), [loading, data]);
	const tableColumns = React.useMemo(
		() =>
			loading
				? columns.map((column) => ({
					...column,
					cell: () => <Skeleton className="h-6 w-50 rounded-sm" />,
				}))
				: columns,
		[loading, columns],
	);

	const table = useReactTable({
		data: tableData,
		columns: tableColumns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		onColumnVisibilityChange: setColumnVisibility,
		autoResetPageIndex: false,
		...(searchableColumns ? { globalFilterFn: customGlobalFilter as FilterFnOption<TData> } : {}),
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			globalFilter,
		},
	});

	const sortedColumnId = sorting.length > 0 ? sorting[0].id : null;

	// show every row if controls are disabled
	useEffect(() => {
		if (disableExtra || disablePagination) {
			table.setPageSize(data.length);
		}
	}, [disableExtra, disablePagination, data.length]);

	useEffect(() => {
		if (initialPageSize && !disablePagination) {
			table.setPageSize(initialPageSize);
		}
	}, [initialPageSize, disablePagination]);

	// 7.26% of data, never higher than a second, nor lower than 40ms
	const timerLengthPercentage = useMemo(
		() => Math.min(1000, Math.max(40, Math.floor(tableData.length * 0.0725))),
		[tableData.length],
	);

	const pageCount = table.getPageCount();
	const currentPage = table.getState().pagination.pageIndex + 1;

	const pageSelectOptions = Array.from({ length: pageCount || 1 }, (_, idx) => idx + 1).map((pageIndex) => {
		return { label: `Page ${String(pageIndex)}`, value: pageIndex };
	});

	const handlePageSelect = (pageIndex: string) => {
		table.setPageIndex(Number(pageIndex) - 1);
	};

	const handleRowClick = (e: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
		if (typeof onRowClick !== 'function') return;

		const clickedElement = e.target as HTMLElement;
		const parent = clickedElement.closest('[data-slot="table-cell"]');
		const tableRow = e.currentTarget;

		if (tableRow.contains(clickedElement)) {
			if (!parent?.firstElementChild?.contains(clickedElement)) {
				onRowClick(row);
			}
		}
	};

	return (
		<div className="w-[100%] mx-auto">
			{/* filter/searchbar*/}

			{disableExtra ? null : (
				<div className="flex items-end justify-between py-4">
					<DebouncedInput
						ref={searchInputRef}
						debounce={timerLengthPercentage}
						label=""
						placeholder={searchPlaceholder ?? 'Start typing to search'}
						value={globalFilter ?? ''}
						onChange={(value) => {
							onSearch && onSearch(value);
							// don't trigger filtering with empty data
							if (loading) return;
							setGlobalFilter(value);
						}}
						className="max-w-sm"
					/>
					{/** render out custom filters */}
					{renderFilters && renderFilters(table)}
				</div>
			)}

			<div className="rounded-md border">
				<Table className="table-fixed">
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => {
							return (
								<TableRow key={headerGroup.id} className="py-6">
									{headerGroup.headers.map((header) => {
										const isSorted = header.column.id === sortedColumnId;
										const thInitialWidth = header.column.getSize();
										const thWidth = (header.column.columnDef as LibColumnDef<TData, TValue>)?.width || thInitialWidth;

										return (
											<TableHead
												key={header.id}
												className={cn('transition-colors py-1', isSorted && 'bg-gray-100 dark:bg-gray-700')}
												style={{ width: thWidth }}
											>
												<div className="line-clamp-2 break-all leading-snug">
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</div>
											</TableHead>
										);
									})}
								</TableRow>
							);
						})}
					</TableHeader>

					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => {
								return (
									<TableRow
										onClick={(e) => handleRowClick(e, row)}
										className="py-6"
										key={row.id}
										data-state={row.getIsSelected() && 'selected'}
									>
										{row.getVisibleCells().map((visibleCell) => {
											const isSorted = visibleCell.column.id === sortedColumnId;
											const tdInitialWidth = visibleCell.column.getSize();
											const tdWidth =
												(visibleCell.column.columnDef as LibColumnDef<TData, TValue>)?.width || tdInitialWidth;

											return (
												<TableCell
													style={{ width: tdWidth }}
													key={visibleCell.id}
													className={cn(
														'transition-colors py-6 text-ellipsis',
														isSorted && 'bg-gray-100 dark:bg-gray-700',
													)}
												>
													<div className="line-clamp-3 break-words leading-snug">
														{renderCellWithHighlight(visibleCell)}
													</div>
												</TableCell>
											);
										})}
									</TableRow>
								);
							})
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-48 text-center">
									No entries
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{disableExtra ? null : (
				<div className="flex items-center justify-end space-x-2 py-6">
					<div className="text-muted-foreground flex-1 text-sm">
						Showing {table.getRowModel().rows.length} of {table.getPrePaginationRowModel().rows.length} entries
					</div>
					{!disablePagination && (
						<>
							<div className="flex w-[100px] items-center justify-center text-sm font-medium">
								Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
							</div>

							<Button variant="outline" size="sm" onClick={() => table.firstPage()} disabled={!table.getCanPreviousPage()}>
								{'<<'}
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={() => table.previousPage()}
								disabled={!table.getCanPreviousPage()}
							>
								Previous
							</Button>
							<Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
								Next
							</Button>

							<Button variant="outline" size="sm" onClick={() => table.lastPage()} disabled={!table.getCanNextPage()}>
								{'>>'}
							</Button>
							<SelectWithOptions
								value={String(currentPage) || undefined}
								placeholder="Go to page"
								options={pageSelectOptions}
								onValueChange={handlePageSelect}
								disabled={loading}
							/>
					</>
				)}
				</div>
			)}
		</div>
	);
}

export type { LibColumnDef as DataTableColumnDef };