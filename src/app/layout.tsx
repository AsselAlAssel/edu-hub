import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "../styles/globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

const font = IBM_Plex_Sans({
	weight: ["400", "500", "600", "700"],
	subsets: ["cyrillic"],
	display: "swap",
});

export const metadata = {
	verification: {
		google: "Z_CVlOktniTFxzGBAkRiR6BEv8fZKQt0ZnbgOt3e_3g",
	},
};

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='ar' suppressHydrationWarning={true} dir='rtl'>
			<ThemeRegistry direction='rtl'>
				<body
					className={`${font.className} flex min-h-screen flex-col dark:bg-[#151F34]`}
				>
					{children}
				</body>
				<GoogleAnalytics gaId={"G-DQH5D3ML0F"} />
				<GoogleTagManager gtmId={"GTM-TNVX8SCS"} />

				<Analytics />
			</ThemeRegistry>
		</html>
	);
};

export default layout;
