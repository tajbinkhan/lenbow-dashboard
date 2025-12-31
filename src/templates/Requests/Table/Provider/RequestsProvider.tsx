import { useSearchParams } from "next/navigation";
import { createContext, useMemo, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { initialPagination } from "@/core/constants";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransactionRequestsListQuery } from "@/redux/APISlices/TransactionAPISlice";
import { initialRequestsApiSearchParams } from "@/templates/Requests/Table/Data/data";

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

	// Router & Pathname
	const router = useRouter();
	const pathname = usePathname();

	// Local state
	const [search, setSearch] = useState(searchParams.get("search") || "");
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
	 * Handles the search form submission event.
	 *
	 * This function performs the following actions:
	 * - Prevents the default form submission behavior
	 * - Updates the selected global values with the search term
	 * - Updates the search parameters in the URL
	 * - Updates the API search parameters (triggers RTK Query refetch)
	 *
	 * @param {React.FormEvent<HTMLFormElement>} event - The form submission event object
	 * @returns {void}
	 */
	const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const currentSearchParam = searchParams.get("search") || "";
		if (search === currentSearchParam) return;

		const searchObject = {
			key: "search",
			value: search
		};
		handleSearchParams([searchObject]);
		setSelectedIds([]);
		setApiSearchParams(prevState => ({
			...prevState,
			search
		}));
	};

	/**
	 * Deletes a specific search parameter from the URL and updates the route.
	 * @param key - The key of the search parameter to be deleted from the URL
	 * @remarks
	 * This function creates a new URLSearchParams object from the current search parameters,
	 * removes the specified parameter, and updates the URL without triggering a page scroll.
	 */
	const handleDeleteSearch = (key: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete(key);
		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	/**
	 * Handles the date filter functionality.
	 * Updates the selected date range state, updates search parameters, and triggers a refetch.
	 * @param date - The date range object containing the 'from' and 'to' dates
	 * @remarks
	 */
	const handleDateFilter = (date: DateRange) => {
		// Update the selected date range state
		setSelectedDateRange(date);

		// Prepare parameters for both URL and API
		const fromDate = date.from ? date.from.toISOString().split("T")[0] : undefined; // Format as YYYY-MM-DD
		const toDate = date.to ? date.to.toISOString().split("T")[0] : undefined; // Format as YYYY-MM-DD

		// Prepare search objects for URL parameters
		const searchObjects = [];

		// Add fromDate to search objects if it exists
		if (fromDate) {
			searchObjects.push({ key: "from", value: fromDate });
		} else {
			handleDeleteSearch("from");
		}

		// Add toDate to search objects if it exists
		if (toDate) {
			searchObjects.push({ key: "to", value: toDate });
		} else {
			handleDeleteSearch("to");
		}

		// Update URL if we have date parameters
		if (searchObjects.length > 0) {
			handleSearchParams(searchObjects);
		}

		setSelectedIds([]);
		// Update API search parameters (triggers RTK Query refetch)
		setApiSearchParams(prevState => ({
			...prevState,
			from: date.from,
			to: date.to
		}));
	};

	/**
	 * Handles the sorting functionality for the table.
	 * Updates the sorting method and direction, updates search parameters, and triggers a refetch.
	 *
	 * @param sortBy - The column/field to sort by
	 * @param sortOrder - The sort direction ('asc' for ascending or 'desc' for descending)
	 *
	 * @remarks
	 * This function:
	 * - Updates the sorting state
	 * - Updates URL search parameters
	 * - Updates API search parameters (triggers RTK Query refetch)
	 */
	const handleSorting = (sortBy: string, sortOrder: "asc" | "desc") => {
		sortSetOrder(sortBy);
		setSortOrder(sortOrder);
		const searchObject = [
			{
				key: "sortBy",
				value: sortBy
			},
			{
				key: "sortOrder",
				value: sortOrder
			}
		];
		handleSearchParams(searchObject);
		setSelectedIds([]);
		setApiSearchParams(prevState => ({
			...prevState,
			sortBy,
			sortOrder
		}));
	};

	/**
	 * Handles filtering options by updating search parameters and API search state
	 * @param key - The filter key/identifier to be updated
	 * @param value - The new filter value(s) to be set
	 * @remarks
	 * This function performs two main actions:
	 * 1. Updates search parameters via handleSearchParams
	 * 2. Updates API search state via setApiSearchParams (triggers RTK Query refetch)
	 * @example
	 * handleOptionFilter("status", "active")
	 * handleOptionFilter("requests", ["food", "drinks"])
	 */
	const handleOptionFilter = (key: string, value: string | string[] | undefined | null) => {
		const isDefaultPagination =
			(key === "page" && value === "1") || (key === "limit" && value === "10");

		if (isDefaultPagination) {
			// For default pagination, remove these params from URL
			handleDeleteSearch(key);
		} else {
			// For non-default values, update URL as normal
			const searchObject = { key, value };
			handleSearchParams([searchObject]);
		}

		// Only reset selection if the filter is NOT pagination-related
		const isPaginationFilter = key === "page" || key === "limit";
		if (!isPaginationFilter) {
			setSelectedIds([]);
		}

		// Always update API params regardless (triggers RTK Query refetch)
		setApiSearchParams(prevState => ({
			...prevState,
			[key]: value
		}));
	};

	/**
	 * Resets all filter values while preserving pagination and sorting parameters.
	 *
	 * This function:
	 * - Clears the search text
	 * - Resets selected global values
	 * - Resets API search parameters while keeping page, limit, and sorting (triggers RTK Query refetch)
	 * - Updates URL params to only keep pagination and sorting
	 */
	const handleResetAll = () => {
		setSearch("");
		setSelectedDateRange({ from: undefined, to: undefined });
		setSelectedIds([]);

		// Preserve pagination and sorting parameters
		const preservedParams = {
			page: searchParams.get("page"),
			limit: searchParams.get("limit"),
			sortBy: searchParams.get("sortBy"),
			sortOrder: searchParams.get("sortOrder")
		};

		// Update API params with preserved values (triggers RTK Query refetch)
		setApiSearchParams({
			...initialRequestsApiSearchParams,
			page: Number(preservedParams.page) || initialRequestsApiSearchParams.page,
			limit: Number(preservedParams.limit) || initialRequestsApiSearchParams.limit,
			sortBy: preservedParams.sortBy || "id",
			sortOrder:
				(preservedParams.sortOrder as "asc" | "desc") || initialRequestsApiSearchParams.sortOrder
		});

		// Update URL with only preserved parameters
		const newParams = new URLSearchParams();
		Object.entries(preservedParams).forEach(([key, value]) => {
			if (value) newParams.set(key, value);
		});

		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	/**
	 * Handles the deletion of selected data.
	 * This function sends a DELETE request to the API using RTK Query mutation.
	 */
	const handleDeleteSelected = () => {
		startDelete(async () => {
			try {
				// TODO: Replace with actual delete function from RTK Query when available
				// await deleteRequests({ ids: selectedIds }).unwrap();
				toast.success("Successfully deleted selected data");
				setSelectedIds([]);
			} catch (error) {
				toast.error("Failed to delete selected data");
			}
		});
	};

	const handleRefresh = () => {
		// Return a promise for toast notification
		return toast.promise(refetch().unwrap(), {
			loading: "Refreshing data...",
			success: "Data refreshed successfully!",
			error: "Failed to refresh data"
		});
	};

	/**
	 * Updates the status of a requests in the mock data
	 * TODO: Replace with actual API call when available
	 */

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
