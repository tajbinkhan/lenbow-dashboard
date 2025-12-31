import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";

const extendedButtonVariants = cva("", {
	variants: {
		variant: {
			success:
				"bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700",
			warning:
				"bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500/20 focus-visible:border-amber-500 dark:bg-amber-600 dark:hover:bg-amber-700",
			info: "bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-500/20 focus-visible:border-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700",
			purple:
				"bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 dark:bg-purple-600 dark:hover:bg-purple-700",
			pink: "bg-pink-500 text-white hover:bg-pink-600 focus-visible:ring-pink-500/20 focus-visible:border-pink-500 dark:bg-pink-600 dark:hover:bg-pink-700",
			indigo:
				"bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-700",
			teal: "bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-500/20 focus-visible:border-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700",
			cyan: "bg-cyan-500 text-white hover:bg-cyan-600 focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-700",
			rose: "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500/20 focus-visible:border-rose-500 dark:bg-rose-600 dark:hover:bg-rose-700",
			orange:
				"bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 dark:bg-orange-600 dark:hover:bg-orange-700",
			lime: "bg-lime-500 text-white hover:bg-lime-600 focus-visible:ring-lime-500/20 focus-visible:border-lime-500 dark:bg-lime-600 dark:hover:bg-lime-700",
			slate:
				"bg-slate-500 text-white hover:bg-slate-600 focus-visible:ring-slate-500/20 focus-visible:border-slate-500 dark:bg-slate-600 dark:hover:bg-slate-700"
		}
	}
});

type ExtendedVariant = VariantProps<typeof extendedButtonVariants>["variant"];
type BaseVariant = VariantProps<typeof buttonVariants>["variant"];

interface ExtendedButtonProps
	extends
		Omit<React.ComponentProps<typeof Button>, "variant">,
		Omit<VariantProps<typeof buttonVariants>, "variant"> {
	variant?: BaseVariant | ExtendedVariant;
}

function ExtendedButton({ className, variant, ...props }: ExtendedButtonProps) {
	// Check if it's an extended variant
	const isExtendedVariant =
		variant &&
		[
			"success",
			"warning",
			"info",
			"purple",
			"pink",
			"indigo",
			"teal",
			"cyan",
			"rose",
			"orange",
			"lime",
			"slate"
		].includes(variant);

	if (isExtendedVariant) {
		return (
			<Button
				variant="default"
				className={cn(extendedButtonVariants({ variant: variant as ExtendedVariant }), className)}
				{...props}
			/>
		);
	}

	return <Button variant={variant as BaseVariant} className={className} {...props} />;
}

export { ExtendedButton, extendedButtonVariants };
