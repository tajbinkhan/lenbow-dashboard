export const initialHistoryApiSearchParams: HistoryApiSearchParams = {
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

export const TRANSACTION_STATUS = [
	{ value: "pending", label: "Pending" },
	{ value: "accepted", label: "Accepted" },
	{ value: "rejected", label: "Rejected" },
	{ value: "partially_paid", label: "Partially Paid" },
	{ value: "requested_repay", label: "Requested Repay" },
	{ value: "completed", label: "Completed" }
];
