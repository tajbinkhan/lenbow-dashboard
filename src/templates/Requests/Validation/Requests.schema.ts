import z from "zod";

import { validateClientNumber, validateDate, validateString } from "@/validators/commonRule";

export const createRequestsSchema = z.object({
	lenderId: validateString("Account ID", { min: 36, max: 36 }),
	amount: validateClientNumber("Amount"),
	dueDate: validateDate("Due date").optional()
});

export const updatePendingRequestsSchema = z.object({
	amount: validateClientNumber("Amount"),
	dueDate: validateDate("Due date").optional()
});

export type CreateRequestsSchema = z.infer<typeof createRequestsSchema>;
export type UpdatePendingRequestsSchema = z.infer<typeof updatePendingRequestsSchema>;
