"use client";

import { Table } from "@tanstack/react-table";
import { Plus, RefreshCw, Search, X } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import DataTableDeleteSelected from "@/components/table/data-table-delete-selected";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import RequestsCreateModal from "@/templates/Desktop/Requests/Form/RequestsCreateModal";
import { TRANSACTION_TYPE } from "@/templates/Desktop/Requests/Table/Data/data";
import { useRequests } from "@/templates/Desktop/Requests/Table/Hook/useRequests";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const {
		search,
		tableData,
		setSearch,
		handleSearch,
		selectedGlobalValues,
		handleResetAll,
		isDeleting,
		handleDeleteSelected,
		selectedIds,
		handleOptionFilter,
		searchParams,
		isRequestsCreateModalOpen,
		setIsRequestsCreateModalOpen,
		handleRefresh,
		isFetching
	} = useRequests();

	return (
		<>
			{/* Requests Create Modal */}
			<RequestsCreateModal
				isCreateModalOpen={isRequestsCreateModalOpen}
				setIsCreateModalOpen={setIsRequestsCreateModalOpen}
			/>
			<div className="flex items-center justify-between">
				<div className="flex flex-1 items-center space-x-2">
					<form onSubmit={handleSearch} className="relative flex items-center">
						<div className="relative">
							<div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
								<Search className="size-4" />
								<span className="sr-only">Search</span>
							</div>
							<Input
								placeholder="Type 3 letters to search..."
								value={search}
								onChange={event => setSearch(event.target.value)}
								type="text"
								className="peer pl-9"
							/>
						</div>
					</form>
					<DataTableFacetedFilter
						title="Transaction Type"
						options={TRANSACTION_TYPE}
						queryParameter="type"
						handleOptionFilter={handleOptionFilter}
						searchParams={searchParams}
						selectedGlobalValues={selectedGlobalValues}
					/>
					{selectedGlobalValues && (
						<Button variant="ghost" onClick={handleResetAll} className="h-8 px-2 lg:px-3">
							Reset
							<X />
						</Button>
					)}
				</div>
				<div className="flex items-center gap-2">
					<ExtendedButton
						variant="default"
						size="sm"
						className="ml-auto hidden h-8 lg:flex"
						onClick={() => setIsRequestsCreateModalOpen(true)}
					>
						<Plus className="size-4" aria-hidden="true" />
						Add Requests
					</ExtendedButton>
					<ExtendedButton
						variant="orange"
						size="sm"
						className="ml-auto hidden h-8 lg:flex"
						onClick={() => handleRefresh()}
						disabled={isFetching}
					>
						<RefreshCw
							className={`size-4 ${isFetching ? "animate-spin" : ""}`}
							aria-hidden="true"
						/>
						Refresh
					</ExtendedButton>
					{tableData.length > 0 && (
						<DataTableDeleteSelected
							selectedIds={selectedIds}
							isDeleting={isDeleting}
							handleDeleteSelected={handleDeleteSelected}
						/>
					)}
					<DataTableViewOptions table={table} />
				</div>
			</div>
		</>
	);
}
