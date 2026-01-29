"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ExtendedBadge, type ExtendedVariant } from "@/components/custom-ui/extended-badge";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useAuth from "@/hooks/use-auth";
import { DataTableToolbar } from "@/templates/Desktop/History/Table/Components/DataTableToolbar";
import { useHistory } from "@/templates/Desktop/History/Table/Hook/useHistory";

// Helper function to format action text
const formatActionText = (action: string): string => {
	return action
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
};

export default function DataColumns() {
	const {
		isLoading,
		selectedIds,
		sortBy,
		sortOrder,
		handleSorting,
		handleOptionFilter,
		pagination,
		tableData
	} = useHistory();

	const { user } = useAuth();

	const columns: ColumnDef<TransactionHistoryInterface>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Name"
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

				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={image || undefined}
								alt={userName}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<AvatarFallback>{userName?.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<span className="max-w-32 truncate">{userName || "Unknown"}</span>
					</div>
				);
			}
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Email"
				/>
			),
			cell: ({ row }) => {
				const email =
					user && user.id === row.original.borrower.id
						? row.original.lender.email
						: row.original.borrower.email;

				return <span>{email}</span>;
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
				const variant: ExtendedVariant = row.original.type === "lend" ? "cyan" : "destructive";
				return (
					<ExtendedBadge variant={variant}>
						{row.original.type.charAt(0).toUpperCase() + row.original.type.slice(1)}
					</ExtendedBadge>
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
			cell: ({ row }) => `${row.original.currency.symbol}${row.original.amount}`
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
					<ExtendedBadge variant={"default"}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</ExtendedBadge>
				);
			},
			enableSorting: false
		},
		{
			accessorKey: "action",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Transaction Action"
				/>
			),
			cell: ({ row }) => {
				const action = row.original.action;
				return <ExtendedBadge variant={"cyan"}>{formatActionText(action)}</ExtendedBadge>;
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
					title="Requested On"
				/>
			),
			cell: ({ row }) =>
				new Date(row.original.requestDate || "").toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour12: true
				})
		},
		{
			accessorKey: "dueDate",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Due Date"
				/>
			),
			cell: ({ row }) => {
				if (!row.original.dueDate) {
					return "N/A";
				}

				return new Date(row.original.dueDate || "").toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
					hour12: true
				});
			}
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
		/>
	);
}
