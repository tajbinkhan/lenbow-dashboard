"use client";

import { ColumnDef } from "@tanstack/react-table";

import { ExtendedBadge, type ExtendedVariant } from "@/components/custom-ui/extended-badge";
import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

import useAuth from "@/hooks/use-auth";
import { DataTableRowActions } from "@/templates/Requests/Table/Components/DataTableRowActions";
import { DataTableToolbar } from "@/templates/Requests/Table/Components/DataTableToolbar";
import { useRequests } from "@/templates/Requests/Table/Hook/useRequests";

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

	const columns: ColumnDef<RequestsInterface>[] = [
		{
			id: "select",
			header: ({ table }) => {
				const handleSelection = (value: boolean) => {
					// Delay execution to get updated selection state
					setTimeout(() => {
						const selectedRows = table.getSelectedRowModel().rows;

						if (value) {
							const selectedIds = selectedRows.map(row => row.original.id);
							setSelectedIds(selectedIds);
						} else {
							setSelectedIds([]);
						}
					}, 0);

					table.toggleAllPageRowsSelected(value);
				};

				return (
					<Checkbox
						checked={
							selectedIds.length > 0
								? table.getIsAllPageRowsSelected() ||
									(table.getIsSomePageRowsSelected() && "indeterminate")
								: false
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
					<ExtendedBadge variant={"warning"}>
						{status.charAt(0).toUpperCase() + status.slice(1)}
					</ExtendedBadge>
				);
			}
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
