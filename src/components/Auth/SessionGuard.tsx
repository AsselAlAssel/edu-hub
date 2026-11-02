"use client";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

// Survives reloads, so a fresh page in a browser whose session was revoked
// (signed in on another device) is told apart from a guest.
const FLAG = "signed-in";
const flag = {
	get: () => {
		try {
			return localStorage.getItem(FLAG) === "1";
		} catch {
			return false;
		}
	},
	set: (on: boolean) => {
		try {
			if (on) localStorage.setItem(FLAG, "1");
			else localStorage.removeItem(FLAG);
		} catch {
			// Storage blocked: behave as a guest.
		}
	},
};

// Set by SessionGuard; lets non-axios callers (fetch) report a 401 too.
let onUnauthorized = () => {};
export const reportUnauthorized = () => onUnauthorized();

/** The user's own sign-out: no "session ended" toast afterwards. */
export const logout = () => {
	flag.set(false);
	return signOut({ callbackUrl: "/" });
};

/**
 * A signed-in user whose session died (signed in on another device, expired)
 * is signed out and sent home the moment any API answers 401 or the session
 * comes back empty. Guests getting a 401 are left alone.
 */
export default function SessionGuard() {
	const { status } = useSession();
	const router = useRouter();
	const kicking = useRef(false);

	useEffect(() => {
		onUnauthorized = () => {
			if (!flag.get() || kicking.current) return;
			kicking.current = true;
			flag.set(false);
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
		if (status === "authenticated") flag.set(true);
		else if (status === "unauthenticated") onUnauthorized();
	}, [status]);

	return null;
}
