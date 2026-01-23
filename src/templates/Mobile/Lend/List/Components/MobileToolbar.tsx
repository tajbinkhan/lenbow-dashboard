"use client";

import { RefreshCw, Search } from "lucide-react";

import { ExtendedButton } from "@/components/custom-ui/extended-button";
import { Input } from "@/components/ui/input";

import { useLend } from "@/templates/Mobile/Lend/Hook/useLend";

export function MobileToolbar() {
	const { search, setSearch, handleSearch, handleRefresh, isFetching } = useLend();

	return (
		<>
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
			</div>
		</>
	);
}
