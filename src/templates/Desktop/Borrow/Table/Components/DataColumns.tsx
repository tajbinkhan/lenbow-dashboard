"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ExtendedBadge } from "@/components/custom-ui/extended-badge";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import useAuth from "@/hooks/use-auth";
import { DataTableRowActions } from "@/templates/Desktop/Borrow/Table/Components/DataTableRowActions";
import { DataTableToolbar } from "@/templates/Desktop/Borrow/Table/Components/DataTableToolbar";
import { useBorrow } from "@/templates/Desktop/Borrow/Table/Hook/useBorrow";

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
	} = useBorrow();

	const { user } = useAuth();

	const columns: ColumnDef<TransactionInterface>[] = [
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
			cell: ({ row }) => row.original.amount
		},
		{
			accessorKey: "remainingAmount",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Remaining Amount"
				/>
			),
			cell: ({ row }) => row.original.remainingAmount
		},
		{
			accessorKey: "amountPaid",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Amount Paid"
				/>
			),
			cell: ({ row }) => row.original.amountPaid
		},
		{
			accessorKey: "reviewAmount",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Review Amount"
				/>
			),
			cell: ({ row }) => {
				if (row.original.reviewAmount > 0) {
					return (
						<Tooltip>
							<TooltipTrigger asChild>
								<ExtendedBadge variant="purple">{row.original.reviewAmount}</ExtendedBadge>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									This amount is under review. The lender will confirm the requested amount shortly.
								</p>
							</TooltipContent>
						</Tooltip>
					);
				} else return <span>{row.original.reviewAmount}</span>;
			}
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

				// Format status text: replace underscores with spaces and capitalize each word
				const formattedStatus = status
					.split("_")
					.map(word => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ");

				// Determine badge variant based on status
				const getStatusVariant = (status: string) => {
					switch (status.toLowerCase()) {
						case "partially_paid":
							return "orange";
						case "completed":
							return "success";
						case "requested_repay":
							return "destructive";
						default:
							return "default";
					}
				};

				return <ExtendedBadge variant={getStatusVariant(status)}>{formattedStatus}</ExtendedBadge>;
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
		/>
	);
}
