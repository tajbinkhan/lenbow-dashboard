import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

const extendedBadgeVariants = cva("transition-colors duration-200", {
	variants: {
		variant: {
			// Re-export original variants
			default: "",
			secondary: "",
			destructive: "",
			outline: "",
			ghost: "",
			link: "",
			// Extended color variants with improved consistency
			success:
				"bg-[var(--color-success-bg,oklch(0.62_0.18_156_/_0.10))] [a]:hover:bg-[oklch(0.62_0.18_156_/_0.20)] focus-visible:ring-[oklch(0.62_0.18_156_/_0.20)] dark:focus-visible:ring-[oklch(0.68_0.18_158_/_0.40)] text-[var(--color-success-text,oklch(0.45_0.16_156))] dark:text-[oklch(0.75_0.16_158)] dark:bg-[oklch(0.68_0.18_158_/_0.20)] border-transparent font-medium",
			warning:
				"bg-[var(--color-warning-bg,oklch(0.76_0.16_72_/_0.10))] [a]:hover:bg-[oklch(0.76_0.16_72_/_0.20)] focus-visible:ring-[oklch(0.76_0.16_72_/_0.20)] dark:focus-visible:ring-[oklch(0.80_0.16_72_/_0.40)] text-[var(--color-warning-text,oklch(0.60_0.14_72))] dark:text-[oklch(0.85_0.14_72)] dark:bg-[oklch(0.80_0.16_72_/_0.20)] border-transparent font-medium",
			info: "bg-[var(--color-info-bg,oklch(0.62_0.15_220_/_0.10))] [a]:hover:bg-[oklch(0.62_0.15_220_/_0.20)] focus-visible:ring-[oklch(0.62_0.15_220_/_0.20)] dark:focus-visible:ring-[oklch(0.68_0.15_222_/_0.40)] text-[var(--color-info-text,oklch(0.45_0.13_220))] dark:text-[oklch(0.75_0.12_222)] dark:bg-[oklch(0.68_0.15_222_/_0.20)] border-transparent font-medium",
			purple:
				"bg-[oklch(0.58_0.22_290_/_0.10)] [a]:hover:bg-[oklch(0.58_0.22_290_/_0.20)] focus-visible:ring-[oklch(0.58_0.22_290_/_0.20)] dark:focus-visible:ring-[oklch(0.62_0.22_290_/_0.40)] text-[oklch(0.45_0.20_290)] dark:text-[oklch(0.75_0.18_290)] dark:bg-[oklch(0.62_0.22_290_/_0.20)] border-transparent font-medium",
			pink: "bg-[oklch(0.65_0.20_340_/_0.10)] [a]:hover:bg-[oklch(0.65_0.20_340_/_0.20)] focus-visible:ring-[oklch(0.65_0.20_340_/_0.20)] dark:focus-visible:ring-[oklch(0.68_0.20_340_/_0.40)] text-[oklch(0.50_0.18_340)] dark:text-[oklch(0.80_0.16_340)] dark:bg-[oklch(0.68_0.20_340_/_0.20)] border-transparent font-medium",
			orange:
				"bg-[oklch(0.68_0.18_45_/_0.10)] [a]:hover:bg-[oklch(0.68_0.18_45_/_0.20)] focus-visible:ring-[oklch(0.68_0.18_45_/_0.20)] dark:focus-visible:ring-[oklch(0.72_0.18_45_/_0.40)] text-[oklch(0.52_0.16_45)] dark:text-[oklch(0.82_0.14_45)] dark:bg-[oklch(0.72_0.18_45_/_0.20)] border-transparent font-medium",
			teal: "bg-[oklch(0.58_0.16_180_/_0.10)] [a]:hover:bg-[oklch(0.58_0.16_180_/_0.20)] focus-visible:ring-[oklch(0.58_0.16_180_/_0.20)] dark:focus-visible:ring-[oklch(0.62_0.16_180_/_0.40)] text-[oklch(0.45_0.14_180)] dark:text-[oklch(0.75_0.12_180)] dark:bg-[oklch(0.62_0.16_180_/_0.20)] border-transparent font-medium",
			cyan: "bg-[oklch(0.60_0.14_200_/_0.10)] [a]:hover:bg-[oklch(0.60_0.14_200_/_0.20)] focus-visible:ring-[oklch(0.60_0.14_200_/_0.20)] dark:focus-visible:ring-[oklch(0.64_0.14_200_/_0.40)] text-[oklch(0.45_0.13_200)] dark:text-[oklch(0.75_0.12_200)] dark:bg-[oklch(0.64_0.14_200_/_0.20)] border-transparent font-medium",
			emerald:
				"bg-[oklch(0.62_0.18_156_/_0.10)] [a]:hover:bg-[oklch(0.62_0.18_156_/_0.20)] focus-visible:ring-[oklch(0.62_0.18_156_/_0.20)] dark:focus-visible:ring-[oklch(0.68_0.18_158_/_0.40)] text-[oklch(0.45_0.16_156)] dark:text-[oklch(0.75_0.16_158)] dark:bg-[oklch(0.68_0.18_158_/_0.20)] border-transparent font-medium"
		}
	},
	defaultVariants: {
		variant: "default"
	}
});

export type ExtendedVariant = VariantProps<typeof extendedBadgeVariants>["variant"];

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
		"cyan",
		"emerald"
	].includes(variant as string);

	if (isExtendedVariant) {
		return <Badge className={cn(extendedBadgeVariants({ variant }), className)} {...props} />;
	}

	return <Badge variant={variant as any} className={className} {...props} />;
}

export { ExtendedBadge, extendedBadgeVariants };
