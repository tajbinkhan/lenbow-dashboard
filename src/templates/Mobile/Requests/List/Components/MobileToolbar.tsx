"use client";

import { Plus, RefreshCw, Search, X } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import RequestsCreateModal from "@/templates/Mobile/Requests/Form/RequestsCreateModal";
import { useRequests } from "@/templates/Mobile/Requests/Hook/useRequests";
import { MobileFilterDrawer } from "@/templates/Mobile/Requests/List/Components/MobileFilterDrawer";

export function MobileToolbar() {
	const {
		search,
		setSearch,
		handleSearch,
		selectedGlobalValues,
		handleResetAll,
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
			<div className="flex flex-col gap-4">
				<div className="flex items-center gap-2">
					<form onSubmit={handleSearch} className="relative flex flex-1 items-center">
						<div className="relative w-full">
							<div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
								<Search className="size-4" />
								<span className="sr-only">Search</span>
							</div>
							<Input
								placeholder="Search..."
								value={search}
								onChange={event => setSearch(event.target.value)}
								type="text"
								className="peer w-full pl-9"
							/>
						</div>
					</form>
					<div className="flex gap-2">
						<ExtendedButton
							variant="default"
							size="icon"
							onClick={() => setIsRequestsCreateModalOpen(true)}
						>
							<Plus className="size-4" aria-hidden="true" />
						</ExtendedButton>
						<ExtendedButton
							variant="orange"
							size="icon"
							onClick={() => handleRefresh()}
							disabled={isFetching}
						>
							<RefreshCw
								className={`size-4 ${isFetching ? "animate-spin" : ""}`}
								aria-hidden="true"
							/>
						</ExtendedButton>
					</div>
				</div>

				<div className="flex items-center gap-2 overflow-x-auto pb-2">
					<MobileFilterDrawer />
					{selectedGlobalValues && (
						<Button variant="ghost" onClick={handleResetAll} className="h-8 px-2">
							Reset
							<X className="ml-2 h-4 w-4" />
						</Button>
					)}
				</div>
			</div>
		</>
	);
}
