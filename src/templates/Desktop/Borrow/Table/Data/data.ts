export const initialBorrowApiSearchParams: BorrowApiSearchParams = {
	page: 1,
	limit: 10,
	sortBy: "createdAt",
	sortOrder: "desc",
	search: undefined
};

export const TRANSACTION_TYPE = [
	{ value: "lend", label: "Lend" },
	{ value: "borrow", label: "Borrow" }
];
