interface GlobalLayoutProps {
	children: React.ReactNode;
}

interface GlobalLayoutPropsWithLocale {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

interface GlobalValues {
	[key: string]: string | string[] | undefined;
}

interface GlobalCommonValues {
	label: string;
	value: string;
}

interface ApiSearchParams {
	page: number;
	limit: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
	search?: string;
	from?: Date;
	to?: Date;
}

interface TableSelectData {
	from: Date;
	to: Date;
}

interface Pagination {
	totalItems: number;
	limit: number;
	offset: number;
	currentPage: number;
	totalPages: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}

interface CursorPagination {
	totalItems: number;
	hasMoreBefore: boolean;
	hasMoreAfter: boolean;
	beforeCursor: string;
	afterCursor: string;
	count: number;
}

interface ApiResponse<T> {
	statusCode: number;
	message: string;
	data?: T;
	pagination?: Pagination;
	timestamp: string;
	path: string;
	code?: string;
}

interface ApiCursorResponse<T> {
	statusCode: number;
	message: string;
	data?: T;
	cursorPagination?: CursorPagination;
	timestamp: string;
	path: string;
	code?: string;
}
