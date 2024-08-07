// import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";

// async function checkSession(sessionId: string): Promise<boolean> {
// 	try {
// 		const res = await fetch(
// 			`${process.env.NEXT_PUBLIC_DOMAIN}/api/check-session`,
// 			{
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ sessionId }),
// 			}
// 		);
// 		if (!res.ok) {
// 			return false;
// 		}
// 		const data = await res.json();
// 		return data.valid;
// 	} catch (error) {
// 		return false;
// 	}
// }

// export default withAuth(
// 	async function middleware(req: NextRequestWithAuth) {
// 		const pathname = req.nextUrl?.pathname;
// 		const isAdmin = req.nextauth.token?.role === "ADMIN";
// 		const isUser = req.nextauth.token?.role === "USER";
// 		const sessionId = req.nextauth.token?.sessionId as string;

// 		const isValid = await checkSession(sessionId);

// 		if (!sessionId || !isValid) {
// 			const signInUrl = new URL("/auth/signin", req.url);
// 			signInUrl.searchParams.set("signOut", "true");
// 			return NextResponse.redirect(signInUrl);
// 		}

// 		if (pathname.includes("/admin") && !isAdmin) {
// 			return NextResponse.redirect(new URL("/user", req.url));
// 		}

// 		if (pathname.includes("/user") && !isUser) {
// 			return NextResponse.redirect(new URL("/admin", req.url));
// 		}

// 		return NextResponse.next();
// 	},
// 	{
// 		secret: process.env.SECRET,
// 		callbacks: {
// 			authorized: ({ token }) => !!token,
// 		},
// 	}
// );

// export const config = {
// 	matcher: ["/user/:path*", "/admin/:path*"],
// };
import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// async function checkSession(sessionId: string): Promise<boolean> {
// 	try {
// 		const res = await fetch(
// 			`${process.env.NEXT_PUBLIC_DOMAIN}/api/check-session`,
// 			{
// 				method: "POST",
// 				headers: { "Content-Type": "application/json" },
// 				body: JSON.stringify({ sessionId }),
// 			}
// 		);
// 		if (!res.ok) {
// 			return false;
// 		}
// 		const data = await res.json();
// 		return data.valid;
// 	} catch (error) {
// 		return false;
// 	}
// }

export default withAuth(
	async function middleware(req: NextRequestWithAuth) {
		const pathname = req.nextUrl?.pathname;
		// const sessionId = req.nextauth.token?.sessionId as string;

		// السماح بالوصول إلى صفحة /classes بدون تسجيل الدخول

		// if (sessionId) {
		// 	const isValid = await checkSession(sessionId);
		// 	if (!isValid) {
		// 		const signInUrl = new URL("/auth/signin", req.url);
		// 		signInUrl.searchParams.set("signOut", "true");
		// 		return NextResponse.redirect(signInUrl);
		// 	}
		// }

		const isAdmin = req.nextauth.token?.role === "ADMIN";
		const isUser = req.nextauth.token?.role === "USER";

		if (pathname.includes("/admin") && !isAdmin) {
			return NextResponse.redirect(new URL("/user", req.url));
		}

		if (pathname.includes("/user") && !isUser) {
			return NextResponse.redirect(new URL("/admin", req.url));
		}

		return NextResponse.next();
	},
	{
		secret: process.env.SECRET,
		callbacks: {
			authorized: ({ token, req }) => {
				if (token) {
					return true;
				}
				const pathname = req.nextUrl?.pathname;
				if (pathname.includes("/classes")) {
					return true;
				}
				if (pathname.includes("/class/")) {
					return true;
				}
				return false;
			},
		},
	}
);

export const config = {
	matcher: ["/classes", "/admin/:path*", "/class/:path*"],
};
