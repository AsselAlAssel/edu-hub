import "../../styles/globals.css";
import "../../styles/satoshi.css";
import "react-quill/dist/quill.snow.css";
import "../../styles/globals.css";
import { Providers } from "./providers";
import ToastContext from "../context/ToastContext";
import NextTopLoader from "nextjs-toploader";
import Loader from "@/components/Common/PreLoader";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import { HeaderWrapper } from "@/components/Header/HeaderWrapper";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Loader />
			<>
				<ToastContext />
				<Providers>
					<NextTopLoader
						color='#635BFF'
						crawlSpeed={300}
						showSpinner={false}
						shadow='none'
					/>
					<HeaderWrapper />
					{children}
					<FooterWrapper />
				</Providers>
			</>
		</>
	);
}
