import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function checkSession(sessionId: string): Promise<boolean> {
	try {
		console.log('sessionId222:', sessionId);
		const res = await fetch('http://localhost:3000/api/check-session', { // استخدم المسار المطلق إذا كنت تستخدم سيرفر محلي
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ sessionId }),
		});

		console.log('res.ok:', res.ok);
		if (!res.ok) {
			console.error(`API error: ${res.status} ${res.statusText}`);
			return false;
		}

		const data = await res.json();

		return data.valid;
	} catch (error) {
		console.log('Error checking session:', error);
		return false;
	}
}

export default withAuth(
	async function middleware(req: NextRequestWithAuth) {
		const pathname = req.nextUrl?.pathname;
		const isAdmin = req.nextauth.token?.role === "ADMIN";
		const isUser = req.nextauth.token?.role === "USER";
		const sessionId = req.nextauth.token?.sessionId as string;
		console.log('sessionId11:', sessionId);
		const isValid = await checkSession(sessionId);
		console.log('isValid:', isValid);

		if (!sessionId || !isValid) {
			signOut();
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}

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
