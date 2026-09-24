import AppShell from "@/components/AppShell/AppShell";
import NextTopLoader from "nextjs-toploader";
import { colors } from "../../../theme/tokens";
import { Providers } from "./providers";

/**
 * No server session here on purpose: reading cookies in the shared layout
 * would force every public page to render per request. The session loads on
 * the client (header/account UI only); /admin is still protected by the
 * middleware + its own server check, and every API route authorises itself.
 */
export default function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<NextTopLoader
				color={colors.dark.azure}
				height={2}
				crawlSpeed={300}
				showSpinner={false}
				shadow={false}
			/>
			<AppShell>{children}</AppShell>
		</Providers>
	);
}
