import Header from "@/components/Common/Dashboard/Header";
import Loader from "@/components/Common/PreLoader";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import NextTopLoader from "nextjs-toploader";
import "react-quill/dist/quill.snow.css";
import "../../styles/globals.css";
import "../../styles/satoshi.css";
import ToastContext from "../context/ToastContext";
import { Providers } from "./providers";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* <Loader /> */}
			<>
				<ToastContext />
				<Providers>
					<NextTopLoader
						color='#635BFF'
						crawlSpeed={300}
						showSpinner={false}
						shadow='none'
					/>
					<Header />

					<div
						style={{
							paddingTop: `120px`,
						}}
					>
						{children}
					</div>
					<FooterWrapper />
				</Providers>
			</>
		</>
	);
}
