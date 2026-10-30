"use client";

import { MotionProvider } from "@/components/ui/motion";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		// Not on every tab focus: the server re-reads role and units per request anyway.
		<SessionProvider refetchOnWindowFocus={false}>
			<MotionProvider>{children}</MotionProvider>
		</SessionProvider>
	);
}
