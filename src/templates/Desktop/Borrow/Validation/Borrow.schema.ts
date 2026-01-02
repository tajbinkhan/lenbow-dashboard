import z from "zod";

import { validateClientNumber } from "@/validators/commonRule";

export const partialRepayBorrowSchema = (remainingAmount: number) =>
	z
		.object({
			amount: validateClientNumber("Amount")
		})
		.superRefine((val, ctx) => {
			// after validateClientNumber, amount is a Number
			if (val.amount > remainingAmount) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					path: ["amount"],
					message: `Amount can't be greater than remaining amount (${remainingAmount}).`
				});
			}
		});

export type PartialRepayBorrowSchema = z.infer<ReturnType<typeof partialRepayBorrowSchema>>;
