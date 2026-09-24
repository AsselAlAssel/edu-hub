import AppShell from "@/components/AppShell/AppShell";
import { authOptions } from "@/libs/auth";
import { getServerSession } from "next-auth";
import NextTopLoader from "nextjs-toploader";
import { colors } from "../../../theme/tokens";
import { Providers } from "./providers";

export default async function SiteLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return (
		<Providers session={session}>
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
