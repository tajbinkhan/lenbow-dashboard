"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/table/data-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useAuth from "@/hooks/use-auth";
import { DataTableToolbar } from "@/templates/Desktop/People/Table/Components/DataTableToolbar";
import { usePeople } from "@/templates/Desktop/People/Table/Hook/usePeople";

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
	} = usePeople();

	const { user } = useAuth();

	const columns: ColumnDef<PeopleInterface>[] = [
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
				const image = row.original.image || undefined;
				return (
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage
								src={image}
								alt={row.original.name || row.original.email}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<AvatarFallback>{row.original.name?.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<span className="max-w-32 truncate">{row.original.name || "Unknown"}</span>
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
			cell: ({ row }) => row.original.email
		},

		{
			accessorKey: "phone",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Phone"
				/>
			),
			cell: ({ row }) => {
				const phone = row.original.phone;
				return phone ? phone : "N/A";
			}
		},
		{
			accessorKey: "connectedAt",
			header: ({ column }) => (
				<DataTableColumnHeader
					column={column}
					sortBy={sortBy}
					sortOrder={sortOrder}
					handleSorting={handleSorting}
					title="Connected At"
				/>
			),
			cell: ({ row }) => {
				const date = new Date(row.original.connectedAt);
				return date.toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric"
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
