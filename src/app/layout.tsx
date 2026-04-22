import ThemeRegistry from "@/components/ThemeRegistry/ThemeRegistry";
import "../styles/globals.css";
import { appBodyFontClassName } from "../../theme/fonts";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
	verification: {
		google: "Z_CVlOktniTFxzGBAkRiR6BEv8fZKQt0ZnbgOt3e_3g",
	},
};

const layout = ({ children }: { children: React.ReactNode }) => {
	return (
		<html lang='ar' suppressHydrationWarning={true} dir='rtl'>
			<body
				className={`${appBodyFontClassName} edu-theme-body flex min-h-screen flex-col`}
			>
				{/* يجب أن تبقى كل الـ scripts داخل <body> — وضعها كأشقاء لـ body تحت <html> يسبب hydration error */}
				<ThemeRegistry direction='rtl'>
					{children}
					<GoogleAnalytics gaId={"G-DQH5D3ML0F"} />
					<GoogleTagManager gtmId={"GTM-TNVX8SCS"} />
					<Analytics />
				</ThemeRegistry>
			</body>
		</html>
	);
};

export default layout;
