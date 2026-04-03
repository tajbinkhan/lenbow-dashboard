"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { LoanDetailsContent } from "@/components/custom-ui/loan-details-content";
import { TableDescriptionCell } from "@/components/custom-ui/table-description-cell";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

import useAuth from "@/hooks/use-auth";
import { DataTableRowActions } from "@/templates/Desktop/Requests/Table/Components/DataTableRowActions";
import { DataTableToolbar } from "@/templates/Desktop/Requests/Table/Components/DataTableToolbar";
import { useRequests } from "@/templates/Desktop/Requests/Table/Hook/useRequests";

export default function DataColumns() {
	const {
		isLoading,
		selectedIds,
		setSelectedIds,
		sortBy,
		sortOrder,
		handleSorting,
		handleOptionFilter,
		pagination,
		tableData
	} = useRequests();

	const { user } = useAuth();

	const columns: ColumnDef<TransactionInterface>[] = [
		{
			id: "select",
			header: ({ table }) => {
				const handleSelection = (value: boolean) => {
					table.toggleAllPageRowsSelected(value);

					// Update selectedIds based on the new selection state
					if (value) {
						const selectedIds = table.getRowModel().rows.map(row => row.original.id);
						setSelectedIds(selectedIds);
					} else {
						setSelectedIds([]);
					}
				};

				return (
					<Checkbox
						checked={
							table.getIsAllPageRowsSelected() ||
							(table.getIsSomePageRowsSelected() && "indeterminate")
						}
						onCheckedChange={value => handleSelection(!!value)}
						aria-label="Select all"
						className="translate-y-0.5 rounded"
					/>
				);
			},
			cell: ({ row }) => {
				const handleSelection = (value: boolean) => {
					row.toggleSelected(value);
					setSelectedIds(prev => {
						const newSelectedIds = value
							? [...prev, row.original.id]
							: prev.filter(id => id !== row.original.id);

						return newSelectedIds;
					});
				};

				return (
					<Checkbox
						checked={row.getIsSelected() || selectedIds.includes(row.original.id)}
						onCheckedChange={value => handleSelection(!!value)}
						aria-label="Select row"
						className="translate-y-0.5 rounded"
					/>
				);
			},
			enableSorting: false,
			enableHiding: false
		},
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Contact"
				/>
			),
			cell: ({ row }) => {
				const image =
					user && user.id === row.original.borrower.id
						? row.original.lender.image
						: row.original.borrower.image;

				const userName =
					user && user.id === row.original.borrower.id
						? row.original.lender.name || row.original.lender.email
						: row.original.borrower.name || row.original.borrower.email;

				const email =
					user && user.id === row.original.borrower.id
						? row.original.lender.email
						: row.original.borrower.email;

				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={image || undefined}
								alt={userName}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">{userName || "Unknown"}</p>
							<p className="text-muted-foreground text-xs">{email}</p>
						</div>
					</div>
				);
			}
		},
		{
			accessorKey: "type",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Type"
				/>
			),
			cell: ({ row }) => {
				const isLend = row.original.type === "lend";
				const className = isLend
					? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
					: "bg-red-500/10 text-red-600 dark:text-red-500";
				const Icon = isLend ? ArrowDownLeft : ArrowUpRight;
				return (
					<div className="flex items-center gap-2">
						<Icon className={`h-4 w-4 ${isLend ? "text-emerald-600" : "text-red-600"}`} />
						<Badge variant="secondary" className={className}>
							{row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
						</Badge>
					</div>
				);
			},
			enableSorting: false
		},
		{
			accessorKey: "amount",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Amount"
				/>
			),
			cell: ({ row }) => (
				<div>
					<p className="text-sm font-semibold">
						{row.original.currency.symbol}
						{row.original.amount.toFixed(2)}
					</p>
					<p className="text-muted-foreground text-xs">{row.original.currency.code}</p>
				</div>
			)
		},
		{
			accessorKey: "status",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Transaction Status"
				/>
			),
			cell: ({ row }) => {
				const status = row.original.status;
				return (
					<Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-500">
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
				);
			},
			enableSorting: false
		},
		{
			accessorKey: "requestDate",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Date"
				/>
			),
			cell: ({ row }) => (
				<div>
					<p className="text-sm">
						{format(new Date(row.original.requestDate || ""), "MMM dd, yyyy")}
					</p>
					{row.original.dueDate && (
						<p className="text-muted-foreground text-xs">
							Due: {format(new Date(row.original.dueDate), "MMM dd")}
						</p>
					)}
				</div>
			)
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => <TableDescriptionCell description={row.original.description} />,
			enableSorting: false
		},
		{
			id: "actions",
			cell: ({ row }) => <DataTableRowActions row={row} />
		}
	];

	return (
		<DataTable
			data={tableData}
			isLoading={isLoading}
			columns={columns}
			handleOptionFilter={handleOptionFilter}
			pagination={pagination}
			selectedCount={selectedIds.length}
			DataTableToolbar={DataTableToolbar}
			rowDetailsTitle="Loan Details"
			rowDetailsDescription="Complete loan information"
			renderRowDetails={row => <LoanDetailsContent data={row} />}
		/>
	);
}
