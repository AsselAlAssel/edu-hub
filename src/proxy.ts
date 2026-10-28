import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Classes and class resources are public; /admin requires an ADMIN token.
 * Non-admins used to be redirected to /user, which does not exist.
 */
export default withAuth(
	function proxy(req: NextRequestWithAuth) {
		const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
		if (isAdminRoute && req.nextauth.token?.role !== "ADMIN") {
			return NextResponse.redirect(new URL("/", req.url));
		}
		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		// Guests reach the handler too, which sends them home: there is no
		// sign-in page to redirect to.
		callbacks: { authorized: () => true },
	}
);

export const config = {
	matcher: ["/admin/:path*"],
};
