import z from "zod";

import { validateClientNumber, validateDate, validateString } from "@/validators/commonRule";

export const createRequestsSchema = z.object({
	lenderId: validateString("Lender ID is required"),
	amount: validateClientNumber("Amount is required"),
	dueDate: validateDate("Due date is required").optional()
});

export type CreateRequestsSchema = z.infer<typeof createRequestsSchema>;
