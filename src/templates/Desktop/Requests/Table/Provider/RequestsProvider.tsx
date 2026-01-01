import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useMemo, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { initialPagination } from "@/core/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
	useDeleteTransactionRequestMutation,
	useTransactionRequestsListQuery
} from "@/redux/APISlices/TransactionAPISlice";
import { initialRequestsApiSearchParams } from "@/templates/Desktop/Requests/Table/Data/data";

// ✅ adjust path if needed

interface RequestsContextType {
	// Required States & Functions
	id: string | null;
	setId: React.Dispatch<React.SetStateAction<string | null>>;
	selectedIds: string[];
	setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
	sortBy: string;
	sortSetOrder: React.Dispatch<React.SetStateAction<string>>;
	sortOrder: "asc" | "desc";
	setSortOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>;
	isLoading: boolean;
	selectedDateRange: DateRange;
	pagination: Pagination;
	apiSearchParams: RequestsApiSearchParams;
	setApiSearchParams: React.Dispatch<React.SetStateAction<RequestsApiSearchParams>>;
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	selectedGlobalValues: GlobalValues | undefined;
	searchParams: URLSearchParams;
	isDeleting: boolean;
	handleDeleteSelected: () => void;
	handleDateFilter: (date: DateRange) => void;
	tableData: RequestsInterface[];
	handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
	handleSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
	handleOptionFilter: (key: string, value: string | string[] | undefined | null) => void;
	handleResetAll: () => void;
	handleRefresh: () => ReturnType<typeof toast.promise>;
	isFetching: boolean;

	// Additional States & Functions
	isRequestsCreateModalOpen: boolean;
	setIsRequestsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const RequestsContext = createContext<RequestsContextType | undefined>(undefined);

export default function RequestsProvider({ children }: GlobalLayoutProps) {
	const [id, setId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	// Transitions
	const [isDeleting, startDelete] = useTransition();

	// Search Params
	const searchParams = useSearchParams();

	// Initialize API Search Params if there are search params
	const initializeApiSearchParams: RequestsApiSearchParams = {
		page: Number(searchParams.get("page")) || initialRequestsApiSearchParams.page,
		limit: Number(searchParams.get("limit")) || initialRequestsApiSearchParams.limit,
		sortBy: searchParams.get("sortBy") || initialRequestsApiSearchParams.sortBy,
		sortOrder:
			(searchParams.get("sortOrder") as "asc" | "desc") || initialRequestsApiSearchParams.sortOrder,
		search: searchParams.get("search") || initialRequestsApiSearchParams.search,
		from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
		to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
		type: searchParams.get("type") || initialRequestsApiSearchParams.type
		// status: "pending"
	};

	// API Search Params
	const [apiSearchParams, setApiSearchParams] =
		useState<RequestsApiSearchParams>(initializeApiSearchParams);

	// Pass apiSearchParams to the query hook to enable filtering
	const {
		data: transactionRequestsResponse,
		isLoading,
		refetch,
		isFetching
	} = useTransactionRequestsListQuery(apiSearchParams);

	const [deleteTransactionRequest] = useDeleteTransactionRequestMutation();

	// Router & Pathname
	const router = useRouter();
	const pathname = usePathname();

	// Local state
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const debouncedSearch = useDebounce(search, 500); // ✅ debounce delay (ms)

	const [sortBy, sortSetOrder] = useState<string>(initializeApiSearchParams.sortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initializeApiSearchParams.sortOrder);

	// Initialize selectedDateRange from URL params
	const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
		from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
		to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
	});

	// Additional States & Functions
	const [isRequestsCreateModalOpen, setIsRequestsCreateModalOpen] = useState(false);

	const tableData = transactionRequestsResponse?.data || [];
	const pagination = transactionRequestsResponse?.pagination || initialPagination;

	/**
	 * Derives selectedGlobalValues from search parameters (excluding pagination and sorting params).
	 */
	const selectedGlobalValues = useMemo(() => {
		const preservedParams = {
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
			sortBy: searchParams.get("sortBy"),
			sortOrder: searchParams.get("sortOrder")
		};

		const values = Object.fromEntries(
			Array.from(searchParams.entries()).filter(
				([key]) => !Object.keys(preservedParams).includes(key)
			)
		);

		return Object.keys(values).length ? values : undefined;
	}, [searchParams]);

	/**
	 * Updates the URL search parameters by pushing a new query string.
	 *
	 * @param key - The search parameter key to be updated
	 * @param value - The value(s) to be associated with the key. Can be a string or array of strings
	 *
	 * @remarks
	 * If the value is an array, it will be joined with commas before being added to the URL.
	 * Uses Next.js router to update the URL without page reload.
	 *
	 * Do not use this function directly. Use handleOptionFilter instead.
	 */
	const handleSearchParams = (
		params: { key: string; value: string | string[] | undefined | null }[]
	) => {
		const newParams = new URLSearchParams(searchParams.toString());

		params.forEach(({ key, value }) => {
			if (value) {
				newParams.set(key, Array.isArray(value) ? value.join(",") : value);
			} else {
				newParams.delete(key);
			}
		});

		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	/**
	 * ✅ Debounced search effect:
	 * - Updates URL "search" param (removes if empty)
	 * - Resets page to 1
	 * - Updates apiSearchParams to trigger RTK Query
	 * - Clears selection
	 */
	useEffect(() => {
		const raw = debouncedSearch.trim();
		const currentSearchParam = searchParams.get("search") || "";

		// 🔴 1–2 characters → do nothing
		if (raw.length > 0 && raw.length < 3) return;

		// Avoid redundant updates
		if (raw === currentSearchParam) return;

		// Clear selection
		setSelectedIds([]);

		// Reset page when search changes
		const pageReset = { key: "page", value: "1" };

		if (raw.length === 0) {
			// ✅ User cleared input → remove search param
			handleSearchParams([{ key: "search", value: null }, pageReset]);

			setApiSearchParams(prev => ({
				...prev,
				search: "",
				page: 1
			}));
			return;
		}

		// ✅ raw.length >= 3 → trigger search
		handleSearchParams([{ key: "search", value: raw }, pageReset]);

		setApiSearchParams(prev => ({
			...prev,
			search: raw,
			page: 1
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, searchParams]);

	/**
	 * Handles the search form submission event.
	 * (Optional now. You can keep it to allow "Enter" to trigger immediate search.)
	 */
	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const currentSearchParam = searchParams.get("search") || "";
		const next = search.trim();

		if (next === currentSearchParam) return;

		handleSearchParams([
			{ key: "search", value: next || null },
			{ key: "page", value: "1" }
		]);

		setSelectedIds([]);
		setApiSearchParams(prevState => ({
			...prevState,
			search: next,
			page: 1
		}));
	};

	/**
	 * Deletes a specific search parameter from the URL and updates the route.
	 */
	const handleDeleteSearch = (key: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete(key);
		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	/**
	 * Handles the date filter functionality.
	 */
	const handleDateFilter = (date: DateRange) => {
		setSelectedDateRange(date);

		const fromDate = date.from ? date.from.toISOString().split("T")[0] : undefined;
		const toDate = date.to ? date.to.toISOString().split("T")[0] : undefined;

		const searchObjects: { key: string; value: string | undefined | null }[] = [];

		if (fromDate) searchObjects.push({ key: "from", value: fromDate });
		else handleDeleteSearch("from");

		if (toDate) searchObjects.push({ key: "to", value: toDate });
		else handleDeleteSearch("to");

		if (searchObjects.length > 0) {
			handleSearchParams(searchObjects);
		}

		setSelectedIds([]);
		setApiSearchParams(prevState => ({
			...prevState,
			from: date.from,
			to: date.to,
			page: 1 // ✅ usually expected when filtering by date
		}));

		// Also keep URL page reset consistent if you want:
		handleSearchParams([{ key: "page", value: "1" }]);
	};

	/**
	 * Handles the sorting functionality for the table.
	 */
	const handleSorting = (sortBy: string, sortOrder: "asc" | "desc") => {
		sortSetOrder(sortBy);
		setSortOrder(sortOrder);

		handleSearchParams([
			{ key: "sortBy", value: sortBy },
			{ key: "sortOrder", value: sortOrder }
		]);

		setSelectedIds([]);
		setApiSearchParams(prevState => ({
			...prevState,
			sortBy,
			sortOrder
		}));
	};

	/**
	 * Handles filtering options by updating search parameters and API search state
	 */
	const handleOptionFilter = (key: string, value: string | string[] | undefined | null) => {
		const isDefaultPagination =
			(key === "page" && value === "1") || (key === "limit" && value === "10");

		if (isDefaultPagination) {
			handleDeleteSearch(key);
		} else {
			handleSearchParams([{ key, value }]);
		}

		const isPaginationFilter = key === "page" || key === "limit";
		if (!isPaginationFilter) {
			setSelectedIds([]);
			// ✅ common expectation: when changing a non-pagination filter, reset page
			handleSearchParams([{ key: "page", value: "1" }]);
		}

		setApiSearchParams(prevState => ({
			...prevState,
			[key]: value,
			...(isPaginationFilter ? {} : { page: 1 })
		}));
	};

	/**
	 * Resets all filter values while preserving pagination and sorting parameters.
	 */
	const handleResetAll = () => {
		setSearch("");
		setSelectedDateRange({ from: undefined, to: undefined });
		setSelectedIds([]);

		const preservedParams = {
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
			sortBy: searchParams.get("sortBy"),
			sortOrder: searchParams.get("sortOrder")
		};

		setApiSearchParams({
			...initialRequestsApiSearchParams,
			page: Number(preservedParams.page) || initialRequestsApiSearchParams.page,
			limit: Number(preservedParams.limit) || initialRequestsApiSearchParams.limit,
			sortBy: preservedParams.sortBy || "id",
			sortOrder:
				(preservedParams.sortOrder as "asc" | "desc") || initialRequestsApiSearchParams.sortOrder,
			search: "" // ✅ clear search in API params too
		});

		const newParams = new URLSearchParams();
		Object.entries(preservedParams).forEach(([key, value]) => {
			if (value) newParams.set(key, value);
		});

		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	/**
	 * Handles the deletion of selected data.
	 */
	const handleDeleteSelected = () => {
		startDelete(async () => {
			try {
				await deleteTransactionRequest({ transactionIds: selectedIds }).unwrap();
				toast.success("Successfully deleted selected data");
				setSelectedIds([]);
			} catch (error) {
				toast.error("Failed to delete selected data");
			}
		});
	};

	const handleRefresh = () => {
		return toast.promise(refetch().unwrap(), {
			loading: "Refreshing data...",
			success: "Data refreshed successfully!",
			error: "Failed to refresh data"
		});
	};

	return (
		<RequestsContext.Provider
			value={{
				id,
				setId,
				selectedIds,
				setSelectedIds,
				sortBy,
				sortSetOrder,
				sortOrder,
				setSortOrder,
				isLoading,
				selectedDateRange,
				pagination,
				apiSearchParams,
				setApiSearchParams,
				search,
				setSearch,
				selectedGlobalValues,
				isDeleting,
				handleDeleteSelected,
				handleDateFilter,
				tableData,
				searchParams,
				handleSorting,
				handleOptionFilter,
				handleResetAll,
				handleSearch,
				handleRefresh,
				isFetching,

				// Additional States & Functions
				isRequestsCreateModalOpen,
				setIsRequestsCreateModalOpen
			}}
		>
			{children}
		</RequestsContext.Provider>
	);
}
