import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Loader from "@/components/ui/loader";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/NextThemesProvider";
import { RedirectProvider } from "@/providers/RedirectProvider";
import ReduxProvider from "@/providers/ReduxProvider";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
	variable: "--font-poppins"
});

export const metadata: Metadata = {
	title: {
		template: "%s | Lenbow",
		default: "Lenbow | Loan Management Application"
	},
	description: "A comprehensive loan management application to streamline your lending processes."
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
		<html lang="en" className={poppins.className} suppressHydrationWarning>
			<body className="antialiased" suppressHydrationWarning>
				<Suspense fallback={<Loader />}>
					<ReduxProvider>
						<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
							<RedirectProvider>
								<NextIntlClientProvider>
									{children}
									<Toaster position="top-right" richColors closeButton />
								</NextIntlClientProvider>
							</RedirectProvider>
						</ThemeProvider>
					</ReduxProvider>
				</Suspense>
			</body>
		</html>
	);
}
