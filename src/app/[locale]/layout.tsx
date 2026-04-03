import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Loader from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/NextThemesProvider";
import { PWAProvider } from "@/providers/PWAProvider";
import { RedirectProvider } from "@/providers/RedirectProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
	variable: "--font-sans"
});

export const metadata: Metadata = {
	applicationName: "Lenbow",
	title: {
		template: "%s | Lenbow",
		default: "Lenbow | Loan Management Application"
	},
	description: "A comprehensive loan management application to streamline your lending processes.",
	manifest: "/manifest.webmanifest",
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: "Lenbow"
	},
	formatDetection: {
		telephone: false
	},
	icons: {
		icon: [
			{ url: "/favicon.ico" },
			{ url: "/pwa/icon-192x192.png", sizes: "192x192", type: "image/png" },
			{ url: "/pwa/icon-512x512.png", sizes: "512x512", type: "image/png" }
		],
		apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
	},
	other: {
		"mobile-web-app-capable": "yes"
	}
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	viewportFit: "cover",
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#6d28d9" },
		{ media: "(prefers-color-scheme: dark)", color: "#7c3aed" }
	]
};

export default async function RootLayout({
	children,
	params
}: Readonly<GlobalLayoutPropsWithLocale>) {
	const { locale } = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	// Enable static rendering
	setRequestLocale(locale);

	return (
		<html
			lang={locale}
			className={`${plusJakartaSans.variable} ${plusJakartaSans.className}`}
			suppressHydrationWarning
		>
			<body className="antialiased" suppressHydrationWarning>
				<Suspense fallback={<Loader />}>
					<ReduxProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<PWAProvider>
								<RedirectProvider>
									<NextIntlClientProvider>
										{children}
										<Toaster position="top-right" richColors closeButton />
									</NextIntlClientProvider>
								</RedirectProvider>
							</PWAProvider>
						</ThemeProvider>
					</ReduxProvider>
				</Suspense>
			</body>
		</html>
	);
}
