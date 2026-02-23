import { NextIntlClientProvider } from "next-intl";

import { Toaster } from "@/components/ui/sonner";

import { ThemeProvider } from "./NextThemesProvider";
import ReduxProvider from "./ReduxProvider";
import { fetchMe } from "@/service/AuthService";

interface AppProvidersProps {
	children: React.ReactNode;
}

export default async function AppProviders({ children }: AppProvidersProps) {
	// Fetch user inside Suspense boundary
	const user = await fetchMe();

	return (
		<ReduxProvider user={user}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<NextIntlClientProvider>
					{children}
					<Toaster position="top-right" richColors closeButton />
				</NextIntlClientProvider>
			</ThemeProvider>
		</ReduxProvider>
	);
}
