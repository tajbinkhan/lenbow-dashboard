type TransactionStatusType =
	| "pending"
	| "accepted"
	| "rejected"
	| "partially_paid"
	| "requested_repay"
	| "completed";

interface TransactionInterface {
	id: string;
	publicId: string;
	borrower: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	lender: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	type: "lend" | "borrow";
	amount: number;
	amountPaid: number;
	remainingAmount: number;
	currency: {
		symbol: string;
		name: string;
		code: string;
	};
	reviewAmount: number;
	rejectionReason: string | null;
	requestDate: string | null;
	acceptedAt: string | null;
	completedAt: string | null;
	rejectedAt: string | null;
	status: TransactionStatusType;
	description: string | null;
	dueDate: string | null;
	createdBy: string;
	createdAt: string;
	updatedAt: string;
}

interface TransactionHistoryInterface {
	publicId: string;
	createdAt: Date;
	updatedAt: Date;
	currency: {
		symbol: string;
		name: string;
		code: string;
	};
	amount: number;
	amountPaid: number;
	remainingAmount: number;
	reviewAmount: number;
	status: TransactionStatusType;
	description: string | null;
	rejectionReason: string | null;
	dueDate: Date | null;
	requestDate: Date;
	acceptedAt: Date | null;
	completedAt: Date | null;
	rejectedAt: Date | null;
	transactionId: number | null;
	transactionPublicId: string;
	action:
		| "create"
		| "update"
		| "status_change"
		| "delete"
		| "partial_repay"
		| "complete_repay"
		| "request_repay"
		| "accept_repay"
		| "reject_repay"
		| "add_payment";
	occurredAt: Date;
	id: string;
	type: "lend" | "borrow";
	borrower: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	lender: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	};
	createdBy: string;
}
