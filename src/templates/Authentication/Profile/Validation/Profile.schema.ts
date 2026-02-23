import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

import { validateString } from "@/validators/commonRule";

export const currencyUpdateSchema = z.object({
	currency: validateString("Currency", { min: 3, max: 3 })
});

export const updateProfileSchema = z.object({
	name: validateString("Full Name", { min: 2, max: 100 }),
	phone: validateString("Phone Number")
		.refine(value => !value || isValidPhoneNumber(value), "Invalid phone number format")
		.optional()
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export type CurrencyUpdateSchema = z.infer<typeof currencyUpdateSchema>;
