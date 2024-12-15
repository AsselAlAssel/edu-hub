import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "../styles/globals.css";
import { IBM_Plex_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import Head from "next/head";

const font = IBM_Plex_Sans({
	weight: ["100", "200", "300", "400", "500", "600", "700"],
	subsets: ["cyrillic"],
});

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='ar' suppressHydrationWarning={true} dir='rtl'>
			<ThemeRegistry direction='rtl'>
				<Head>
					<meta
						name='google-site-verification'
						content='Z_CVlOktniTFxzGBAkRiR6BEv8fZKQt0ZnbgOt3e_3g'
					/>
				</Head>
				<body
					className={`${font.className} flex min-h-screen flex-col dark:bg-[#151F34]`}
				>
					{children}
				</body>
				<GoogleAnalytics gaId={"GTM-TNVX8SCS"} />
			</ThemeRegistry>
		</html>
	);
};

export default layout;
