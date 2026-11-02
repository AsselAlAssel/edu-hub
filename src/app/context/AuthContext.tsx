"use client";
import axios from "axios";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

// Set by SessionGuard; lets non-axios callers (fetch) report a 401 too.
let onUnauthorized = () => {};
export const reportUnauthorized = () => onUnauthorized();

/**
 * A signed-in user whose session died (signed in on another device, expired)
 * is signed out and sent home the moment any API answers 401 or the session
 * refetch comes back empty. Guests getting a 401 are left alone.
 */
function SessionGuard() {
	const { status } = useSession();
	const router = useRouter();
	const signedIn = useRef(false);
	const kicking = useRef(false);

	useEffect(() => {
		onUnauthorized = () => {
			if (!signedIn.current || kicking.current) return;
			kicking.current = true;
			signedIn.current = false;
			toast.error("انتهت جلستك أو تم تسجيل الدخول من جهاز آخر", {
				id: "session-ended",
			});
			void signOut({ redirect: false }).finally(() => {
				kicking.current = false;
				router.replace("/");
				router.refresh();
			});
		};
		const id = axios.interceptors.response.use(undefined, (error) => {
			if (error?.response?.status === 401) onUnauthorized();
			return Promise.reject(error);
		});
		return () => axios.interceptors.response.eject(id);
	}, [router]);

	useEffect(() => {
		if (status === "authenticated") signedIn.current = true;
		else if (status === "unauthenticated") onUnauthorized();
	}, [status]);

	return null;
}

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<SessionProvider>
			<SessionGuard />
			{children}
		</SessionProvider>
	);
}
