interface RequestsApiSearchParams extends ApiSearchParams {
	type?: string;
	status?: string;
}

interface RequestsInterface {
	id: string;
	publicId: string;
	contact: {
		id: string;
		name: string | null;
		email: string;
		image: string | null;
	} | null;
	type: "lend" | "borrow";
	amount: number;
	amountPaid: number;
	status: "pending" | "accepted" | "rejected" | "partially_paid" | "completed";
	description: string | null;
	dueDate: string | null;
	createdAt: string;
	updatedAt: string;
}
