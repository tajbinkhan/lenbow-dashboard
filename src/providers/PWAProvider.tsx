"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

type InstallPromptOutcome = "accepted" | "dismissed";

type BeforeInstallPromptEvent = Event & {
	prompt: () => Promise<void>;
	userChoice: Promise<{
		outcome: InstallPromptOutcome;
		platform: string;
	}>;
};

interface PWAContextValue {
	canInstall: boolean;
	install: () => Promise<void>;
	isInstalled: boolean;
	isIOSInstallable: boolean;
	isOffline: boolean;
}

const PWAContext = createContext<PWAContextValue | undefined>(undefined);

const NETWORK_TOAST_ID = "pwa-network-status";

function isStandaloneMode() {
	if (typeof window === "undefined") {
		return false;
	}

	const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };
	return (
		window.matchMedia("(display-mode: standalone)").matches ||
		navigatorWithStandalone.standalone === true
	);
}

function isIOSDevice() {
	if (typeof window === "undefined") {
		return false;
	}

	return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function PWAProvider({ children }: { children: ReactNode }) {
	const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
	const [isInstalled, setIsInstalled] = useState(false);
	const [isIOSInstallable, setIsIOSInstallable] = useState(false);
	const [isOffline, setIsOffline] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const updateInstallState = () => {
			const installed = isStandaloneMode();
			setIsInstalled(installed);
			setIsIOSInstallable(isIOSDevice() && !installed);
		};

		const syncNetworkStatus = (online: boolean) => {
			setIsOffline(!online);
			toast.dismiss(NETWORK_TOAST_ID);

			if (!online) {
				toast.warning(
					"You're offline. Cached assets remain available, but live account data needs a connection.",
					{
						id: NETWORK_TOAST_ID,
						duration: 5000
					}
				);
				return;
			}

			toast.success("You're back online. Lenbow can load live data again.", {
				id: NETWORK_TOAST_ID,
				duration: 3500
			});
		};

		const syncInitialState = () => {
			updateInstallState();

			if (!window.navigator.onLine) {
				setIsOffline(true);
				toast.warning(
					"You're offline. Cached assets remain available, but live account data needs a connection.",
					{
						id: NETWORK_TOAST_ID,
						duration: 5000
					}
				);
				return;
			}

			setIsOffline(false);
		};

		syncInitialState();

		const displayModeQuery = window.matchMedia("(display-mode: standalone)");

		const handleBeforeInstallPrompt = (event: Event) => {
			const installEvent = event as BeforeInstallPromptEvent;
			event.preventDefault();
			setDeferredPrompt(installEvent);
			updateInstallState();
		};

		const handleAppInstalled = () => {
			setDeferredPrompt(null);
			setIsInstalled(true);
			setIsIOSInstallable(false);
			toast.success("Lenbow is installed and ready from your home screen.");
		};

		const handleDisplayModeChange = () => {
			updateInstallState();
		};

		const handleOnline = () => {
			syncNetworkStatus(true);
		};

		const handleOffline = () => {
			syncNetworkStatus(false);
		};

		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt as unknown as EventListener
		);
		window.addEventListener("appinstalled", handleAppInstalled);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		if (typeof displayModeQuery.addEventListener === "function") {
			displayModeQuery.addEventListener("change", handleDisplayModeChange);
		} else {
			displayModeQuery.addListener(handleDisplayModeChange);
		}

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt as unknown as EventListener
			);
			window.removeEventListener("appinstalled", handleAppInstalled);
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);

			if (typeof displayModeQuery.removeEventListener === "function") {
				displayModeQuery.removeEventListener("change", handleDisplayModeChange);
			} else {
				displayModeQuery.removeListener(handleDisplayModeChange);
			}
		};
	}, []);

	useEffect(() => {
		if (typeof window === "undefined" || process.env.NODE_ENV !== "production") {
			return;
		}

		if (!("serviceWorker" in window.navigator)) {
			return;
		}

		const isSecureContext =
			window.location.protocol === "https:" ||
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1";

		if (!isSecureContext) {
			return;
		}

		navigator.serviceWorker
			.register("/sw.js", {
				scope: "/",
				updateViaCache: "none"
			})
			.then(registration => registration.update().catch(() => undefined))
			.catch(error => {
				console.error("PWA service worker registration failed.", error);
			});
	}, []);

	const install = async () => {
		if (!deferredPrompt) {
			return;
		}

		await deferredPrompt.prompt();

		const { outcome } = await deferredPrompt.userChoice;
		setDeferredPrompt(null);

		if (outcome === "dismissed") {
			toast.info("Install was dismissed. You can try again any time.");
		}
	};

	return (
		<PWAContext.Provider
			value={{
				canInstall: Boolean(deferredPrompt) && !isInstalled,
				install,
				isInstalled,
				isIOSInstallable,
				isOffline
			}}
		>
			{children}
		</PWAContext.Provider>
	);
}

export function usePwa() {
	const context = useContext(PWAContext);

	if (!context) {
		throw new Error("usePwa must be used within a PWAProvider.");
	}

	return context;
}
