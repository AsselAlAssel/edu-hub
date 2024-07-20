import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req: NextRequestWithAuth) {
		const pathname = req.nextUrl?.pathname;
		const isAdmin = req.nextauth.token?.role === "ADMIN";
		const isUser = req.nextauth.token?.role === "USER";

		if (pathname.includes("/admin") && !isAdmin) {
			return NextResponse.redirect(new URL("/user", req.url));
		}

		if (pathname.includes("/user") && !isUser) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		// if logged in redirect to admin
		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		callbacks: {
			authorized: (params) => {
				const { token } = params;
				return !!token;
			},
		},
	}
);

export const config = {
	matcher: ["/user/:path*", "/admin/:path*"],
};
