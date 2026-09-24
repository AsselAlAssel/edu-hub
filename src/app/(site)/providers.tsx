"use client";

import { MotionProvider } from "@/components/ui/motion";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider>
			<MotionProvider>{children}</MotionProvider>
		</SessionProvider>
	);
}
