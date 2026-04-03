"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type Table as TableInstance,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import * as React from "react";

import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Button } from "@/components/ui/button";
import {
	ResponsiveDialog,
	ResponsiveDialogBody,
	ResponsiveDialogClose,
	ResponsiveDialogContent,
	ResponsiveDialogDescription,
	ResponsiveDialogFooter,
	ResponsiveDialogHeader,
	ResponsiveDialogTitle
} from "@/components/ui/responsive-dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	isLoading: boolean;
	data: TData[];
	pagination: Pagination;
	selectedCount?: number;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
	DataTableToolbar: React.ComponentType<{ table: TableInstance<TData> }>;
	rowDetailsTitle?: string;
	rowDetailsDescription?: string;
	renderRowDetails?: (row: TData) => React.ReactNode;
}

export function DataTable<TData, TValue>({
	columns,
	isLoading,
	data,
	pagination,
	selectedCount = 0,
	handleOptionFilter,
	DataTableToolbar,
	rowDetailsTitle = "Details",
	rowDetailsDescription = "Full item details",
	renderRowDetails
}: DataTableProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [activeRow, setActiveRow] = React.useState<TData | null>(null);

	// Reset table row selection when selectedCount becomes 0 (e.g., when filters are triggered)
	React.useEffect(() => {
		if (selectedCount === 0 && Object.keys(rowSelection).length > 0) {
			setRowSelection({});
		}
	}, [selectedCount, rowSelection]);

	// eslint-disable-next-line react-hooks/incompatible-library
	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	const shouldIgnoreRowClick = (target: EventTarget | null) => {
		if (!(target instanceof HTMLElement)) {
			return false;
		}

		return Boolean(
			target.closest(
				"button, a, input, textarea, select, option, label, [role='button'], [data-no-row-click='true']"
			)
		);
	};

	return (
		<div className="space-y-4">
			<DataTableToolbar table={table} />
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(header.column.columnDef.header, header.getContext())}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRow className="w-full">
								<TableCell colSpan={columns.length} className="h-24 text-center">
									<div className="flex items-center justify-center gap-2">
										<Loader2 className="animate-spin" />
										<span>Loading...</span>
									</div>
								</TableCell>
							</TableRow>
						) : table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className={renderRowDetails ? "group cursor-pointer" : "group"}
									onClick={event => {
										if (!renderRowDetails || shouldIgnoreRowClick(event.target)) {
											return;
										}

										setActiveRow(row.original);
									}}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									<div className="flex flex-col items-center justify-center py-8 text-center">
										<p className="text-muted-foreground text-sm">
											No results found. Try adjusting your filters.
										</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination
				table={table}
				pagination={pagination}
				selectedCount={selectedCount}
				handleOptionFilter={handleOptionFilter}
			/>
			{renderRowDetails && (
				<ResponsiveDialog
					open={Boolean(activeRow)}
					onOpenChange={isOpen => {
						if (!isOpen) {
							setActiveRow(null);
						}
					}}
				>
					<ResponsiveDialogContent className="sm:max-w-2xl">
						<ResponsiveDialogHeader>
							<ResponsiveDialogTitle>{rowDetailsTitle}</ResponsiveDialogTitle>
							<ResponsiveDialogDescription>{rowDetailsDescription}</ResponsiveDialogDescription>
						</ResponsiveDialogHeader>
						<ResponsiveDialogBody className="max-h-[70vh] overflow-y-auto px-0">
							{activeRow ? renderRowDetails(activeRow) : null}
						</ResponsiveDialogBody>
						<ResponsiveDialogFooter>
							<ResponsiveDialogClose asChild>
								<Button variant="outline">Close</Button>
							</ResponsiveDialogClose>
						</ResponsiveDialogFooter>
					</ResponsiveDialogContent>
				</ResponsiveDialog>
			)}
		</div>
	);
}
