import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import { route } from "@/routes/routes";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Redirect root path to dashboard
	if (pathname === "/" || pathname === "") {
		return NextResponse.redirect(new URL(route.private.dashboard, request.url));
	}

	return intlMiddleware(request);
}

export const config = {
	// Match all pathnames except for
	// - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
	// - … the ones containing a dot (e.g. `favicon.ico`)
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
};
