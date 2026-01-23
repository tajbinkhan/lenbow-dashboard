"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";

import { initialPagination } from "@/core/constants";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransactionLendListQuery } from "@/redux/APISlices/TransactionAPISlice";
import { initialLendApiSearchParams } from "@/templates/Mobile/Lend/Data/data";

interface LendContextType {
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
	apiSearchParams: LendApiSearchParams;
	setApiSearchParams: React.Dispatch<React.SetStateAction<LendApiSearchParams>>;
	search: string;
	setSearch: React.Dispatch<React.SetStateAction<string>>;
	selectedGlobalValues: GlobalValues | undefined;
	searchParams: URLSearchParams;
	handleDateFilter: (date: DateRange) => void;
	tableData: TransactionInterface[];
	handleSearch: (event: React.FormEvent<HTMLFormElement>) => void;
	handleSorting: (sortBy: string, sortOrder: "asc" | "desc") => void;
	handleOptionFilter: (key: string, value: string | string[] | undefined | null) => void;
	handleResetAll: () => void;
	handleRefresh: () => ReturnType<typeof toast.promise>;
	isFetching: boolean;
	loadMore: () => void;
	hasMore: boolean;

	// Active Transaction for Details Drawer
	activeTransaction: TransactionInterface | null;
	setActiveTransaction: React.Dispatch<React.SetStateAction<TransactionInterface | null>>;
}

export const LendContext = createContext<LendContextType | undefined>(undefined);

export default function LendProvider({ children }: GlobalLayoutProps) {
	const [id, setId] = useState<string | null>(null);
	const [selectedIds, setSelectedIds] = useState<string[]>([]);

	// Search Params
	const searchParams = useSearchParams();

	// Initialize API Search Params if there are search params
	const initializeApiSearchParams: LendApiSearchParams = {
		page: Number(searchParams.get("page")) || initialLendApiSearchParams.page,
		limit: Number(searchParams.get("limit")) || initialLendApiSearchParams.limit,
		sortBy: searchParams.get("sortBy") || initialLendApiSearchParams.sortBy,
		sortOrder:
			(searchParams.get("sortOrder") as "asc" | "desc") || initialLendApiSearchParams.sortOrder,
		search: searchParams.get("search") || initialLendApiSearchParams.search,
		from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
		to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
		type: searchParams.get("type") || initialLendApiSearchParams.type
	};

	// API Search Params
	const [apiSearchParams, setApiSearchParams] =
		useState<LendApiSearchParams>(initializeApiSearchParams);

	// Pass apiSearchParams to the query hook to enable filtering
	const {
		data: transactionLendResponse,
		isLoading,
		refetch,
		isFetching
	} = useTransactionLendListQuery(apiSearchParams);

	// Router & Pathname
	const router = useRouter();
	const pathname = usePathname();

	// Local state
	const [search, setSearch] = useState(searchParams.get("search") || "");
	const debouncedSearch = useDebounce(search, 500); // 500ms debounce delay

	const [sortBy, sortSetOrder] = useState<string>(initializeApiSearchParams.sortBy);
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initializeApiSearchParams.sortOrder);

	// Initialize selectedDateRange from URL params
	const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
		from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
		to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined
	});

	// Active Transaction for Details Drawer
	const [activeTransaction, setActiveTransaction] = useState<TransactionInterface | null>(null);

	// Accumulated Data for Infinite Scroll
	const [accumulatedData, setAccumulatedData] = useState<TransactionInterface[]>([]);
	const [hasMore, setHasMore] = useState(true);

	// Sync accumulated data
	useEffect(() => {
		if (transactionLendResponse?.data) {
			if (apiSearchParams.page === 1) {
				setAccumulatedData(transactionLendResponse.data);
			} else {
				setAccumulatedData(prev => {
					// Create a Map to ensure uniqueness by ID
					const newData = transactionLendResponse.data || [];
					const combined = [...prev, ...newData];
					const unique = new Map(combined.map(item => [item.id, item]));
					return Array.from(unique.values());
				});
			}

			const totalPages = transactionLendResponse.pagination?.totalPages || 1;
			setHasMore(apiSearchParams.page < totalPages);
		}
	}, [transactionLendResponse, apiSearchParams.page]);

	const tableData = accumulatedData;
	const pagination = transactionLendResponse?.pagination || initialPagination;

	const loadMore = () => {
		if (!isFetching && hasMore) {
			setApiSearchParams(prev => ({ ...prev, page: prev.page + 1 }));
		}
	};

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
	 * Debounced search effect
	 */
	useEffect(() => {
		const raw = debouncedSearch.trim();
		const currentSearchParam = searchParams.get("search") || "";

		if (raw.length > 0 && raw.length < 3) return;
		if (raw === currentSearchParam) return;

		setSelectedIds([]);

		const pageReset = { key: "page", value: "1" };

		if (raw.length === 0) {
			handleSearchParams([{ key: "search", value: null }, pageReset]);
			setApiSearchParams(prev => ({
				...prev,
				search: "",
				page: 1
			}));
			return;
		}

		handleSearchParams([{ key: "search", value: raw }, pageReset]);
		setApiSearchParams(prev => ({
			...prev,
			search: raw,
			page: 1
		}));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearch, searchParams]);

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

	const handleDeleteSearch = (key: string) => {
		const newParams = new URLSearchParams(searchParams.toString());
		newParams.delete(key);
		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

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
			page: 1
		}));

		handleSearchParams([{ key: "page", value: "1" }]);
	};

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

	const handleOptionFilter = (key: string, value: string | string[] | undefined | null) => {
		const updates: { key: string; value: string | string[] | null | undefined }[] = [];

		const isDefaultPagination =
			(key === "page" && value === "1") || (key === "limit" && value === "10");

		if (isDefaultPagination) {
			updates.push({ key, value: null });
		} else {
			updates.push({ key, value });
		}

		const isPaginationFilter = key === "page" || key === "limit";
		if (!isPaginationFilter) {
			setSelectedIds([]);
			updates.push({ key: "page", value: "1" });
		}

		handleSearchParams(updates);

		setApiSearchParams(prevState => ({
			...prevState,
			[key]: value,
			...(isPaginationFilter ? {} : { page: 1 })
		}));
	};

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
			...initialLendApiSearchParams,
			page: Number(preservedParams.page) || initialLendApiSearchParams.page,
			limit: Number(preservedParams.limit) || initialLendApiSearchParams.limit,
			sortBy: preservedParams.sortBy || "id",
			sortOrder:
				(preservedParams.sortOrder as "asc" | "desc") || initialLendApiSearchParams.sortOrder,
			search: ""
		});

		const newParams = new URLSearchParams();
		Object.entries(preservedParams).forEach(([key, value]) => {
			if (value) newParams.set(key, value);
		});

		router.replace(`${pathname}?${newParams.toString()}`, { scroll: false });
	};

	const handleRefresh = () => {
		setAccumulatedData([]);
		setApiSearchParams(prev => ({ ...prev, page: 1 }));
		handleSearchParams([{ key: "page", value: "1" }]);

		return toast.promise(refetch().unwrap(), {
			loading: "Refreshing data...",
			success: "Data refreshed successfully!",
			error: "Failed to refresh data"
		});
	};

	return (
		<LendContext.Provider
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
				handleDateFilter,
				tableData,
				searchParams,
				handleSorting,
				handleOptionFilter,
				handleResetAll,
				handleSearch,
				handleRefresh,
				isFetching,
				loadMore,
				hasMore,
				activeTransaction,
				setActiveTransaction
			}}
		>
			{children}
		</LendContext.Provider>
	);
}
