import z from "zod";

import {
	validateClientNumber,
	validateDate,
	validateEnum,
	validateString
} from "@/validators/commonRule";

export const createRequestsSchema = z.object({
	lenderId: validateString("Lender ID is required"),
	amount: validateClientNumber("Amount is required"),
	type: validateEnum("Type", ["lend", "borrow"]),
	dueDate: validateDate("Due date is required").optional()
});

export type CreateRequestsSchema = z.infer<typeof createRequestsSchema>;
