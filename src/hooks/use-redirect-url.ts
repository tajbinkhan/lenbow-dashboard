"use client";

import { useSearchParams } from "next/navigation";

/**
 * Custom hook to get the redirect URL from query parameters
 * Use this in authentication pages to get where to redirect after login
 * @returns The redirect URL string or null if not present
 */
export function useRedirectUrl() {
	const searchParams = useSearchParams();
	const redirectUrl = searchParams.get("redirect");

	return redirectUrl;
}
