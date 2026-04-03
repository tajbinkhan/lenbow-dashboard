"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

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
					title="Contact"
				/>
			),
			cell: ({ row }) => {
				const image = row.original.image || undefined;
				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={image}
								alt={row.original.name || row.original.email}
								width={40}
								height={40}
								className="rounded-full"
							/>
							<AvatarFallback>{row.original.name?.slice(0, 2)}</AvatarFallback>
						</Avatar>
						<div>
							<p className="text-sm font-medium">{row.original.name || "Unknown"}</p>
							<p className="text-muted-foreground text-xs">{row.original.email}</p>
						</div>
					</div>
				);
			}
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
				return phone ? (
					<span className="text-sm">{phone}</span>
				) : (
					<span className="text-muted-foreground text-sm">N/A</span>
				);
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
				return <span className="text-sm">{format(date, "MMM dd, yyyy")}</span>;
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
			rowDetailsTitle="Contact Details"
			rowDetailsDescription="Complete contact information"
			renderRowDetails={row => (
				<div className="grid gap-3 px-4 pb-2 md:grid-cols-2 md:px-0">
					<div className="space-y-1 rounded-md border p-3">
						<p className="text-muted-foreground text-xs">Name</p>
						<p className="text-sm font-medium">{row.name || "Unknown"}</p>
					</div>
					<div className="space-y-1 rounded-md border p-3">
						<p className="text-muted-foreground text-xs">Email</p>
						<p className="text-sm font-medium wrap-break-word">{row.email || "N/A"}</p>
					</div>
					<div className="space-y-1 rounded-md border p-3">
						<p className="text-muted-foreground text-xs">Phone</p>
						<p className="text-sm font-medium">{row.phone || "N/A"}</p>
					</div>
					<div className="space-y-1 rounded-md border p-3">
						<p className="text-muted-foreground text-xs">Connected At</p>
						<p className="text-sm font-medium">
							{format(new Date(row.connectedAt), "MMM dd, yyyy")}
						</p>
					</div>
				</div>
			)}
		/>
	);
}
