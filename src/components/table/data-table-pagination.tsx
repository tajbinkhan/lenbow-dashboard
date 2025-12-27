import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from "@/components/ui/select";

import { useIsMobile } from "@/hooks/use-mobile";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
	pagination: Pagination;
	selectedCount?: number;
	handleOptionFilter: (key: string, value?: string | string[] | null) => void;
}

export function DataTablePagination<TData>({
	table,
	pagination,
	selectedCount = 0,
	handleOptionFilter
}: DataTablePaginationProps<TData>) {
	const isMobile = useIsMobile();
	const rowsPerPageOptions = [10, 20, 30, 40, 50];

	useEffect(() => {
		table.setPageSize(pagination.limit);
	}, [pagination.limit, table]);

	if (isMobile) {
		return (
			<div className="flex flex-col gap-4 px-2 py-3 md:hidden">
				{/* Top Section: Selection + Rows per page */}
				<div className="flex items-center justify-between text-sm">
					<div className="text-muted-foreground">
						{selectedCount} of {pagination.totalItems} row(s) selected.
					</div>
					<div className="flex items-center space-x-2">
						<p className="text-sm font-medium">Rows</p>
						<Select
							value={`${pagination.limit}`}
							onValueChange={value => {
								handleOptionFilter("limit", value);
								table.setPageSize(Number(value));
							}}
						>
							<SelectTrigger className="h-8 w-17.5">
								<SelectValue placeholder={pagination.limit} />
							</SelectTrigger>
							<SelectContent side="top">
								{rowsPerPageOptions.map(pageSize => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Bottom Section: Page info + Controls */}
				<div className="flex items-center justify-between">
					<div className="text-sm font-medium">
						Page {pagination.currentPage} of {pagination.totalPages}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={() => handleOptionFilter("page", "1")}
							disabled={pagination.currentPage === 1}
						>
							<ChevronsLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.currentPage > 1
									? () => handleOptionFilter("page", `${pagination.currentPage - 1}`)
									: undefined
							}
							disabled={pagination.currentPage === 1}
						>
							<ChevronLeft />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.currentPage < pagination.totalPages
									? () => handleOptionFilter("page", `${pagination.currentPage + 1}`)
									: undefined
							}
							disabled={
								pagination.currentPage === pagination.totalPages || pagination.totalPages === 0
							}
						>
							<ChevronRight />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							onClick={
								pagination.currentPage < pagination.totalPages
									? () => handleOptionFilter("page", `${pagination.totalPages}`)
									: undefined
							}
							disabled={
								pagination.currentPage === pagination.totalPages || pagination.totalPages === 0
							}
						>
							<ChevronsRight />
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex items-center justify-between px-2">
			<div className="text-muted-foreground flex-1 text-sm">
				{selectedCount} of {pagination.totalItems} row(s) selected.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>
					<Select
						value={`${pagination.limit}`}
						onValueChange={value => {
							handleOptionFilter("limit", value);
							table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-17.5">
							<SelectValue placeholder={pagination.limit} />
						</SelectTrigger>
						<SelectContent side="top">
							{rowsPerPageOptions.map(pageSize => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-25 items-center justify-center text-sm font-medium">
					Page {pagination.currentPage} of {pagination.totalPages}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => handleOptionFilter("page", "1")}
						disabled={pagination.currentPage === 1}
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={
							pagination.currentPage > 1
								? () => handleOptionFilter("page", `${pagination.currentPage - 1}`)
								: undefined
						}
						disabled={pagination.currentPage === 1}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={
							pagination.currentPage < pagination.totalPages
								? () => handleOptionFilter("page", `${pagination.currentPage + 1}`)
								: undefined
						}
						disabled={
							pagination.currentPage === pagination.totalPages || pagination.totalPages === 0
						}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={
							pagination.currentPage < pagination.totalPages
								? () => handleOptionFilter("page", `${pagination.totalPages}`)
								: undefined
						}
						disabled={
							pagination.currentPage === pagination.totalPages || pagination.totalPages === 0
						}
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
		</div>
	);
}
