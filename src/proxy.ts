import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import { route } from "@/routes/routes";
import { fetchMe } from "@/service/AuthService";

// Routes that don't require auth and don't redirect
const publicRoutes: string[] = [];

// Create the next-intl middleware
const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
	// Device detection
	const userAgent = request.headers.get("user-agent") || "";
	const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

	// Run next-intl middleware first
	const response = intlMiddleware(request);

	// Add device type header to the response
	response.headers.set("x-device-type", isMobile ? "mobile" : "desktop");

	const { pathname } = request.nextUrl;

	// Check if current path is a public auth route (like login)
	const isPublicAuthRoute = Object.values(route.protected).some(route =>
		pathname.startsWith(route)
	);

	// Check if current path is a public route (no auth needed)
	const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

	// Skip auth checks for public routes
	if (isPublicRoute) {
		return response;
	}

	// Check authentication status
	const user = await fetchMe();
	const isAuthenticated = user !== null;

	// Handle public auth routes (like login page)
	if (isPublicAuthRoute) {
		if (isAuthenticated) {
			// User is already authenticated, redirect to intended page or dashboard
			const redirectUrl = request.nextUrl.searchParams.get("redirect");

			if (redirectUrl) {
				// Validate redirect URL to prevent open redirects
				try {
					const redirectUrlObj = new URL(redirectUrl);
					// Only allow redirects to same origin
					if (redirectUrlObj.origin === request.nextUrl.origin) {
						const redirectPath = redirectUrlObj.pathname;
						// Don't redirect to protected routes like login
						if (!Object.values(route.protected).includes(redirectPath)) {
							return NextResponse.redirect(redirectUrl);
						}
					}
				} catch {
					// Invalid URL, fall through to default redirect
				}
			}

			// Default redirect to dashboard
			return NextResponse.redirect(new URL(route.private.dashboard, request.url));
		}
		// User is not authenticated, allow access to login page
		return response;
	}

	// All other routes are private by default
	if (!isAuthenticated) {
		// User is not authenticated, redirect to login with redirect parameter
		const loginUrl = new URL(route.protected.login, request.url);
		loginUrl.searchParams.set("redirect", request.url);
		return NextResponse.redirect(loginUrl);
	}

	return response;
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
};
