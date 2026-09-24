import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Classes and class resources are public; /admin requires an ADMIN token.
 * Non-admins used to be redirected to /user, which does not exist.
 */
export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
		if (isAdminRoute && req.nextauth.token?.role !== "ADMIN") {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		callbacks: {
			authorized: ({ token, req }) =>
				!!token || !req.nextUrl.pathname.startsWith("/admin"),
		},
	}
);

export const config = {
	matcher: ["/admin/:path*"],
};
