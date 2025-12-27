import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

const extendedBadgeVariants = cva("", {
	variants: {
		variant: {
			// Re-export original variants
			default: "",
			secondary: "",
			destructive: "",
			outline: "",
			ghost: "",
			link: "",
			// Extended color variants
			success:
				"bg-green-500/10 [a]:hover:bg-green-500/20 focus-visible:ring-green-500/20 dark:focus-visible:ring-green-500/40 text-green-700 dark:text-green-400 dark:bg-green-500/20 border-transparent",
			warning:
				"bg-yellow-500/10 [a]:hover:bg-yellow-500/20 focus-visible:ring-yellow-500/20 dark:focus-visible:ring-yellow-500/40 text-yellow-700 dark:text-yellow-400 dark:bg-yellow-500/20 border-transparent",
			info: "bg-blue-500/10 [a]:hover:bg-blue-500/20 focus-visible:ring-blue-500/20 dark:focus-visible:ring-blue-500/40 text-blue-700 dark:text-blue-400 dark:bg-blue-500/20 border-transparent",
			purple:
				"bg-purple-500/10 [a]:hover:bg-purple-500/20 focus-visible:ring-purple-500/20 dark:focus-visible:ring-purple-500/40 text-purple-700 dark:text-purple-400 dark:bg-purple-500/20 border-transparent",
			pink: "bg-pink-500/10 [a]:hover:bg-pink-500/20 focus-visible:ring-pink-500/20 dark:focus-visible:ring-pink-500/40 text-pink-700 dark:text-pink-400 dark:bg-pink-500/20 border-transparent",
			orange:
				"bg-orange-500/10 [a]:hover:bg-orange-500/20 focus-visible:ring-orange-500/20 dark:focus-visible:ring-orange-500/40 text-orange-700 dark:text-orange-400 dark:bg-orange-500/20 border-transparent",
			teal: "bg-teal-500/10 [a]:hover:bg-teal-500/20 focus-visible:ring-teal-500/20 dark:focus-visible:ring-teal-500/40 text-teal-700 dark:text-teal-400 dark:bg-teal-500/20 border-transparent",
			cyan: "bg-cyan-500/10 [a]:hover:bg-cyan-500/20 focus-visible:ring-cyan-500/20 dark:focus-visible:ring-cyan-500/40 text-cyan-700 dark:text-cyan-400 dark:bg-cyan-500/20 border-transparent"
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

type ExtendedVariant = VariantProps<typeof extendedBadgeVariants>["variant"];

function ExtendedBadge({
	className,
	variant = "default",
	...props
}: Omit<React.ComponentProps<typeof Badge>, "variant"> & {
	variant?: ExtendedVariant;
}) {
	// Use original badge variants for base variants
	const isExtendedVariant = [
		"success",
		"warning",
		"info",
		"purple",
		"pink",
		"orange",
		"teal",
		"cyan"
	].includes(variant as string);

	if (isExtendedVariant) {
		return <Badge className={cn(extendedBadgeVariants({ variant }), className)} {...props} />;
	}

	return <Badge variant={variant as any} className={className} {...props} />;
}

export { ExtendedBadge, extendedBadgeVariants };
