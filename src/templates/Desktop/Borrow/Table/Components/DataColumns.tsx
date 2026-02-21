"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { DescriptionModal } from "@/components/custom-ui/description-modal";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

	const columns: ColumnDef<TransactionInterface>[] = [
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
				const image = row.original.lender.image;
				const name = row.original.lender.name;
				const email = row.original.lender.email;

				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={image || undefined}
								alt={name || "Unknown"}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<AvatarFallback>{name ? name.slice(0, 2) : "Unknown"}</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">{name || "Unknown"}</p>
							<p className="text-muted-foreground text-xs">{email}</p>
						</div>
					</div>
				);
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
			cell: ({ row }) => `${row.original.currency.symbol}${row.original.remainingAmount}`
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
			cell: ({ row }) => `${row.original.currency.symbol}${row.original.amountPaid}`
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
								<Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-500">{`${row.original.currency.symbol}${row.original.reviewAmount}`}</Badge>
							</TooltipTrigger>
							<TooltipContent>
								<p>
									This amount is under review. The lender will confirm the requested amount shortly.
								</p>
							</TooltipContent>
						</Tooltip>
					);
				} else
					return (
						<span className="text-sm">{`${row.original.currency.symbol}${row.original.reviewAmount}`}</span>
					);
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

				// Determine badge styling based on status
				const getStatusClassName = (status: string) => {
					switch (status.toLowerCase()) {
						case "partially_paid":
							return "bg-purple-500/10 text-purple-600 dark:text-purple-500";
						case "completed":
							return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500";
						case "requested_repay":
							return "";
						default:
							return "bg-amber-500/10 text-amber-600 dark:text-amber-500";
					}
				};

				const className = getStatusClassName(status);
				return (
					<Badge
						variant={status === "requested_repay" ? "destructive" : "secondary"}
						className={className}
					>
						{formattedStatus}
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
