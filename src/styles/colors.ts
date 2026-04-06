/**
 * Custom Color Palette for Lenbow Dashboard
 * This file defines a consistent color system across the application
 * without modifying global.css or shadcn default colors
 */

export const colors = {
	// Primary Brand Colors
	brand: {
		primary: {
			50: "oklch(0.96 0.02 272)",
			100: "oklch(0.92 0.05 275)",
			200: "oklch(0.82 0.10 276)",
			300: "oklch(0.72 0.15 277)",
			400: "oklch(0.62 0.20 277)",
			500: "oklch(0.51 0.23 277)", // Main primary color
			600: "oklch(0.45 0.20 278)",
			700: "oklch(0.38 0.17 279)",
			800: "oklch(0.30 0.14 280)",
			900: "oklch(0.22 0.10 281)"
		},
		secondary: {
			50: "oklch(0.97 0.001 286)",
			100: "oklch(0.95 0.002 286)",
			200: "oklch(0.90 0.004 286)",
			300: "oklch(0.85 0.006 286)",
			400: "oklch(0.75 0.008 286)",
			500: "oklch(0.967 0.001 286.375)", // Main secondary
			600: "oklch(0.55 0.010 286)",
			700: "oklch(0.45 0.012 286)",
			800: "oklch(0.35 0.014 286)",
			900: "oklch(0.21 0.006 285.885)"
		}
	},

	// Semantic Colors
	semantic: {
		success: {
			light: "oklch(0.85 0.14 156)",
			DEFAULT: "oklch(0.62 0.18 156)",
			dark: "oklch(0.45 0.16 156)",
			bg: "oklch(0.62 0.18 156 / 0.10)",
			text: "oklch(0.45 0.16 156)"
		},
		warning: {
			light: "oklch(0.88 0.14 72)",
			DEFAULT: "oklch(0.76 0.16 72)",
			dark: "oklch(0.60 0.14 72)",
			bg: "oklch(0.76 0.16 72 / 0.10)",
			text: "oklch(0.60 0.14 72)"
		},
		danger: {
			light: "oklch(0.75 0.18 27)",
			DEFAULT: "oklch(0.58 0.22 27)",
			dark: "oklch(0.45 0.20 27)",
			bg: "oklch(0.58 0.22 27 / 0.10)",
			text: "oklch(0.58 0.22 27)"
		},
		info: {
			light: "oklch(0.75 0.12 220)",
			DEFAULT: "oklch(0.62 0.15 220)",
			dark: "oklch(0.45 0.13 220)",
			bg: "oklch(0.62 0.15 220 / 0.10)",
			text: "oklch(0.45 0.13 220)"
		}
	},

	// UI State Colors
	state: {
		pending: {
			bg: "oklch(0.76 0.16 72 / 0.10)",
			text: "oklch(0.60 0.14 72)",
			border: "oklch(0.76 0.16 72 / 0.30)"
		},
		active: {
			bg: "oklch(0.62 0.18 156 / 0.10)",
			text: "oklch(0.45 0.16 156)",
			border: "oklch(0.62 0.18 156 / 0.30)"
		},
		overdue: {
			bg: "oklch(0.58 0.22 27 / 0.10)",
			text: "oklch(0.58 0.22 27)",
			border: "oklch(0.58 0.22 27 / 0.30)"
		},
		completed: {
			bg: "oklch(0.62 0.15 220 / 0.10)",
			text: "oklch(0.45 0.13 220)",
			border: "oklch(0.62 0.15 220 / 0.30)"
		}
	},

	// Extended Palette for Various UI Elements
	extended: {
		purple: {
			light: "oklch(0.75 0.18 290)",
			DEFAULT: "oklch(0.58 0.22 290)",
			dark: "oklch(0.45 0.20 290)",
			bg: "oklch(0.58 0.22 290 / 0.10)",
			text: "oklch(0.45 0.20 290)"
		},
		pink: {
			light: "oklch(0.80 0.16 340)",
			DEFAULT: "oklch(0.65 0.20 340)",
			dark: "oklch(0.50 0.18 340)",
			bg: "oklch(0.65 0.20 340 / 0.10)",
			text: "oklch(0.50 0.18 340)"
		},
		teal: {
			light: "oklch(0.75 0.12 180)",
			DEFAULT: "oklch(0.58 0.16 180)",
			dark: "oklch(0.45 0.14 180)",
			bg: "oklch(0.58 0.16 180 / 0.10)",
			text: "oklch(0.45 0.14 180)"
		},
		orange: {
			light: "oklch(0.82 0.14 45)",
			DEFAULT: "oklch(0.68 0.18 45)",
			dark: "oklch(0.52 0.16 45)",
			bg: "oklch(0.68 0.18 45 / 0.10)",
			text: "oklch(0.52 0.16 45)"
		},
		indigo: {
			light: "oklch(0.70 0.14 265)",
			DEFAULT: "oklch(0.55 0.18 265)",
			dark: "oklch(0.42 0.16 265)",
			bg: "oklch(0.55 0.18 265 / 0.10)",
			text: "oklch(0.42 0.16 265)"
		}
	},

	// Neutral Grays (for borders, backgrounds, etc.)
	neutral: {
		50: "oklch(0.99 0 0)",
		100: "oklch(0.97 0 0)",
		200: "oklch(0.94 0 0)",
		300: "oklch(0.90 0 0)",
		400: "oklch(0.80 0 0)",
		500: "oklch(0.70 0 0)",
		600: "oklch(0.60 0 0)",
		700: "oklch(0.45 0 0)",
		800: "oklch(0.30 0 0)",
		900: "oklch(0.15 0 0)"
	}
};

// Dark mode color adjustments
export const darkColors = {
	semantic: {
		success: {
			light: "oklch(0.75 0.16 158)",
			DEFAULT: "oklch(0.68 0.18 158)",
			dark: "oklch(0.55 0.16 158)",
			bg: "oklch(0.68 0.18 158 / 0.20)",
			text: "oklch(0.75 0.16 158)"
		},
		warning: {
			light: "oklch(0.85 0.14 72)",
			DEFAULT: "oklch(0.80 0.16 72)",
			dark: "oklch(0.68 0.14 72)",
			bg: "oklch(0.80 0.16 72 / 0.20)",
			text: "oklch(0.85 0.14 72)"
		},
		danger: {
			light: "oklch(0.75 0.18 27)",
			DEFAULT: "oklch(0.704 0.191 22.216)",
			dark: "oklch(0.60 0.18 27)",
			bg: "oklch(0.704 0.191 22.216 / 0.20)",
			text: "oklch(0.75 0.18 27)"
		},
		info: {
			light: "oklch(0.75 0.12 222)",
			DEFAULT: "oklch(0.68 0.15 222)",
			dark: "oklch(0.58 0.13 222)",
			bg: "oklch(0.68 0.15 222 / 0.20)",
			text: "oklch(0.75 0.12 222)"
		}
	}
};

/**
 * Utility function to get color value
 * @param colorPath - Dot notation path to color (e.g., 'semantic.success.DEFAULT')
 * @param isDark - Whether to use dark mode colors
 */
export function getColor(colorPath: string, isDark = false): string {
	const paths = colorPath.split(".");
	let current: any = isDark && paths[0] === "semantic" ? darkColors : colors;

	for (const path of paths) {
		current = current[path];
		if (!current) return "";
	}

	return current;
}

/**
 * CSS Custom Properties for easy integration
 */
export const cssVariables = {
	// Success colors
	"--color-success": colors.semantic.success.DEFAULT,
	"--color-success-light": colors.semantic.success.light,
	"--color-success-dark": colors.semantic.success.dark,
	"--color-success-bg": colors.semantic.success.bg,
	"--color-success-text": colors.semantic.success.text,

	// Warning colors
	"--color-warning": colors.semantic.warning.DEFAULT,
	"--color-warning-light": colors.semantic.warning.light,
	"--color-warning-dark": colors.semantic.warning.dark,
	"--color-warning-bg": colors.semantic.warning.bg,
	"--color-warning-text": colors.semantic.warning.text,

	// Danger colors
	"--color-danger": colors.semantic.danger.DEFAULT,
	"--color-danger-light": colors.semantic.danger.light,
	"--color-danger-dark": colors.semantic.danger.dark,
	"--color-danger-bg": colors.semantic.danger.bg,
	"--color-danger-text": colors.semantic.danger.text,

	// Info colors
	"--color-info": colors.semantic.info.DEFAULT,
	"--color-info-light": colors.semantic.info.light,
	"--color-info-dark": colors.semantic.info.dark,
	"--color-info-bg": colors.semantic.info.bg,
	"--color-info-text": colors.semantic.info.text
};
