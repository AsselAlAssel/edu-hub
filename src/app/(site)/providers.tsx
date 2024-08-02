"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export function Providers({
	children,
	session,
}: {
	children: React.ReactNode;
	session: Session | null;
}) {
	return (
		<ThemeProvider attribute='class' enableSystem={false} defaultTheme='light'>
			<SessionProvider session={session}>{children}</SessionProvider>
		</ThemeProvider>
	);
}
