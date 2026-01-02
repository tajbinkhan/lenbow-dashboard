interface BorrowApiSearchParams extends ApiSearchParams {
	type?: string;
	status?: string;
}

interface BorrowInterface {
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
	rejectionReason: string | null;
	requestDate: string | null;
	acceptedAt: string | null;
	completedAt: string | null;
	rejectedAt: string | null;
	status: "pending" | "accepted" | "rejected" | "partially_paid" | "completed";
	description: string | null;
	dueDate: string | null;
	createdAt: string;
	updatedAt: string;
}
