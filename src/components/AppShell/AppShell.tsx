import ToastContext from "@/app/context/ToastContext";
import BackToTopFab from "@/components/Common/BackToTopFab";
import Header from "@/components/Common/Dashboard/Header";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import type { ReactNode } from "react";

/** Skip link → sticky header → <main> landmark → footer → floating helpers. */
export default function AppShell({ children }: { children: ReactNode }) {
	return (
		<>
			<a href='#main-content' className='qa-skip-link'>
				انتقل إلى المحتوى
			</a>
			<Header />
			<main
				id='main-content'
				tabIndex={-1}
				style={{ flex: 1, outline: "none" }}
			>
				{children}
			</main>
			<FooterWrapper />
			<BackToTopFab />
			<ToastContext />
		</>
	);
}
