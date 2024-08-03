import Header from "@/components/Common/Dashboard/Header";
import Loader from "@/components/Common/PreLoader";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import NextTopLoader from "nextjs-toploader";
import "react-quill/dist/quill.snow.css";
import "../../styles/globals.css";
import ToastContext from "../context/ToastContext";
import { Providers } from "./providers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	return (
		<>
			<Loader />
			<>
				<ToastContext />
				<Providers session={session}>
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
