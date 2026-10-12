"use client";
import useRole from "@/hooks/useRole";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
	WHATS_NEW_STORAGE_KEY as STORAGE_KEY,
	WHATS_NEW_VERSION,
} from "./version";

// Just enough for the page to paint first, so the dialog doesn't pop in
// over a half-loaded screen.
const OPEN_DELAY_MS = 300;

/** Not over sign-in or admin screens; those visitors are mid-task. */
const isQuietPath = (pathname: string) =>
	pathname.startsWith("/admin") || pathname.startsWith("/auth");

const hasSeen = () => {
	try {
		return localStorage.getItem(STORAGE_KEY) === WHATS_NEW_VERSION;
	} catch {
		return true; // Storage blocked: don't show it on every page view.
	}
};

/** Opens the "what's new" dialog once per visitor and version. */
export default function useWhatsNew() {
	const pathname = usePathname();
	const { status } = useSession();
	const { isAdmin } = useRole();
	const [open, setOpen] = useState(false);

	useEffect(() => {
		// Wait for the session: admins don't need the student tour.
		if (status === "loading" || isAdmin || isQuietPath(pathname)) return;
		if (hasSeen()) return;
		const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
		return () => clearTimeout(timer);
	}, [status, isAdmin, pathname]);

	const close = useCallback(() => {
		setOpen(false);
		try {
			localStorage.setItem(STORAGE_KEY, WHATS_NEW_VERSION);
		} catch {
			// See hasSeen.
		}
	}, []);

	return { open, close };
}
