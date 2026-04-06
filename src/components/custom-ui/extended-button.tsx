import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button, buttonVariants } from "@/components/ui/button";

const extendedButtonVariants = cva("transition-all duration-200", {
	variants: {
		variant: {
			success:
				"bg-[var(--color-success,oklch(0.62_0.18_156))] text-white hover:bg-[oklch(0.55_0.16_156)] focus-visible:ring-[oklch(0.62_0.18_156_/_0.20)] focus-visible:border-[oklch(0.62_0.18_156)] dark:bg-[oklch(0.68_0.18_158)] dark:hover:bg-[oklch(0.62_0.16_158)] active:scale-[0.98] shadow-sm hover:shadow-md",
			warning:
				"bg-[var(--color-warning,oklch(0.76_0.16_72))] text-white hover:bg-[oklch(0.70_0.15_72)] focus-visible:ring-[oklch(0.76_0.16_72_/_0.20)] focus-visible:border-[oklch(0.76_0.16_72)] dark:bg-[oklch(0.80_0.16_72)] dark:hover:bg-[oklch(0.76_0.14_72)] active:scale-[0.98] shadow-sm hover:shadow-md",
			info: "bg-[var(--color-info,oklch(0.62_0.15_220))] text-white hover:bg-[oklch(0.55_0.14_220)] focus-visible:ring-[oklch(0.62_0.15_220_/_0.20)] focus-visible:border-[oklch(0.62_0.15_220)] dark:bg-[oklch(0.68_0.15_222)] dark:hover:bg-[oklch(0.62_0.13_222)] active:scale-[0.98] shadow-sm hover:shadow-md",
			purple:
				"bg-[oklch(0.58_0.22_290)] text-white hover:bg-[oklch(0.52_0.20_290)] focus-visible:ring-[oklch(0.58_0.22_290_/_0.20)] focus-visible:border-[oklch(0.58_0.22_290)] dark:bg-[oklch(0.62_0.22_290)] dark:hover:bg-[oklch(0.56_0.20_290)] active:scale-[0.98] shadow-sm hover:shadow-md",
			pink: "bg-[oklch(0.65_0.20_340)] text-white hover:bg-[oklch(0.58_0.19_340)] focus-visible:ring-[oklch(0.65_0.20_340_/_0.20)] focus-visible:border-[oklch(0.65_0.20_340)] dark:bg-[oklch(0.68_0.20_340)] dark:hover:bg-[oklch(0.62_0.18_340)] active:scale-[0.98] shadow-sm hover:shadow-md",
			indigo:
				"bg-[oklch(0.55_0.18_265)] text-white hover:bg-[oklch(0.50_0.17_265)] focus-visible:ring-[oklch(0.55_0.18_265_/_0.20)] focus-visible:border-[oklch(0.55_0.18_265)] dark:bg-[oklch(0.60_0.18_265)] dark:hover:bg-[oklch(0.54_0.17_265)] active:scale-[0.98] shadow-sm hover:shadow-md",
			teal: "bg-[oklch(0.58_0.16_180)] text-white hover:bg-[oklch(0.52_0.15_180)] focus-visible:ring-[oklch(0.58_0.16_180_/_0.20)] focus-visible:border-[oklch(0.58_0.16_180)] dark:bg-[oklch(0.62_0.16_180)] dark:hover:bg-[oklch(0.56_0.15_180)] active:scale-[0.98] shadow-sm hover:shadow-md",
			cyan: "bg-[oklch(0.60_0.14_200)] text-white hover:bg-[oklch(0.54_0.13_200)] focus-visible:ring-[oklch(0.60_0.14_200_/_0.20)] focus-visible:border-[oklch(0.60_0.14_200)] dark:bg-[oklch(0.64_0.14_200)] dark:hover:bg-[oklch(0.58_0.13_200)] active:scale-[0.98] shadow-sm hover:shadow-md",
			rose: "bg-[oklch(0.60_0.20_15)] text-white hover:bg-[oklch(0.54_0.19_15)] focus-visible:ring-[oklch(0.60_0.20_15_/_0.20)] focus-visible:border-[oklch(0.60_0.20_15)] dark:bg-[oklch(0.64_0.20_15)] dark:hover:bg-[oklch(0.58_0.19_15)] active:scale-[0.98] shadow-sm hover:shadow-md",
			orange:
				"bg-[oklch(0.68_0.18_45)] text-white hover:bg-[oklch(0.62_0.17_45)] focus-visible:ring-[oklch(0.68_0.18_45_/_0.20)] focus-visible:border-[oklch(0.68_0.18_45)] dark:bg-[oklch(0.72_0.18_45)] dark:hover:bg-[oklch(0.66_0.17_45)] active:scale-[0.98] shadow-sm hover:shadow-md",
			lime: "bg-[oklch(0.72_0.18_130)] text-white hover:bg-[oklch(0.66_0.17_130)] focus-visible:ring-[oklch(0.72_0.18_130_/_0.20)] focus-visible:border-[oklch(0.72_0.18_130)] dark:bg-[oklch(0.75_0.18_130)] dark:hover:bg-[oklch(0.70_0.17_130)] active:scale-[0.98] shadow-sm hover:shadow-md",
			slate:
				"bg-[oklch(0.50_0.02_260)] text-white hover:bg-[oklch(0.45_0.02_260)] focus-visible:ring-[oklch(0.50_0.02_260_/_0.20)] focus-visible:border-[oklch(0.50_0.02_260)] dark:bg-[oklch(0.55_0.02_260)] dark:hover:bg-[oklch(0.50_0.02_260)] active:scale-[0.98] shadow-sm hover:shadow-md"
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
