"use client";

import SessionGuard from "@/components/Auth/SessionGuard";
import { MotionProvider } from "@/components/ui/motion";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		// Refetch on tab focus: catches a session revoked by a sign-in elsewhere.
		<SessionProvider>
			<SessionGuard />
			<MotionProvider>{children}</MotionProvider>
		</SessionProvider>
	);
}
