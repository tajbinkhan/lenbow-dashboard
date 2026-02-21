"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { DescriptionModal } from "@/components/custom-ui/description-modal";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
				const className =
					status === "rejected"
						? ""
						: status === "completed"
							? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500"
							: "bg-blue-500/10 text-blue-600 dark:text-blue-500";
				return (
					<Badge
						variant={status === "rejected" ? "destructive" : "secondary"}
						className={className}
					>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</Badge>
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
				return (
					<Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-500">
						{formatActionText(action)}
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
			cell: ({ row }) => {
				const description = row.original.description;

				if (!description) {
					return <span className="text-muted-foreground text-xs">No description</span>;
				}

				return (
					<div className="max-w-50">
						<p className="line-clamp-1 text-sm">{description}</p>
						{description.length > 350 && <DescriptionModal description={description} />}
					</div>
				);
			},
			enableSorting: false
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
