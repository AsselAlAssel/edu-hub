import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import { SITE_NAME, SITE_URL } from "@/libs/site";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata, Viewport } from "next";
import { appBodyFontClassName } from "../../theme/fonts";
import { colors, cssVariables } from "../../theme/tokens";
import "../styles/globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: "شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh",
		template: `%s | ${SITE_NAME}`,
	},
	applicationName: SITE_NAME,
	authors: [{ name: "محمد صبح (Mohammed Subuh)", url: SITE_URL }],
	creator: "محمد صبح",
	publisher: SITE_NAME,
	category: "education",
	formatDetection: { telephone: false, email: false, address: false },
	icons: { icon: "/favicon.ico", apple: "/images/logo/logo.svg" },
	verification: {
		google: "Z_CVlOktniTFxzGBAkRiR6BEv8fZKQt0ZnbgOt3e_3g",
	},
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: dark)", color: colors.dark.bg },
		{ media: "(prefers-color-scheme: light)", color: colors.light.bg },
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='ar' dir='rtl' suppressHydrationWarning>
			<head>
				{/* Token CSS variables for both modes — server-rendered, so no colour flash. */}
				<style dangerouslySetInnerHTML={{ __html: cssVariables() }} />
			</head>
			<body className={appBodyFontClassName}>
				<ThemeRegistry direction='rtl'>
					{children}
					<GoogleAnalytics gaId='G-DQH5D3ML0F' />
					<GoogleTagManager gtmId='GTM-TNVX8SCS' />
					<Analytics />
				</ThemeRegistry>
			</body>
		</html>
	);
}
