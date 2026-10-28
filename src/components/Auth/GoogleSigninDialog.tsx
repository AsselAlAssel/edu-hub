"use client";
import AppDialog from "@/components/ui/AppDialog";
import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/** Google's multicolour "G" mark. */
export const GoogleLogo = () => (
	<svg width='20' height='20' viewBox='0 0 48 48' aria-hidden>
		<path
			fill='#EA4335'
			d='M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z'
		/>
		<path
			fill='#4285F4'
			d='M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z'
		/>
		<path
			fill='#FBBC05'
			d='M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z'
		/>
		<path
			fill='#34A853'
			d='M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z'
		/>
	</svg>
);

const RETURN_KEY = "signin-return";
const ERROR_KEY = "signin-error";

/** Google sign-in that returns to the current page, on success or failure. */
export function signInWithGoogle() {
	const here = window.location.pathname + window.location.search;
	try {
		sessionStorage.setItem(RETURN_KEY, here);
	} catch {
		// Storage blocked: a failed sign-in then returns to the home page.
	}
	void signIn("google", { callbackUrl: here });
}

/**
 * Used by /auth/error (NextAuth's error page): remembers a message for the
 * page the student came from and returns the URL to send them back to.
 */
export function stashSigninError() {
	const message = "تعذّر تسجيل الدخول بحساب Google، حاول مرة أخرى.";
	try {
		sessionStorage.setItem(ERROR_KEY, message);
		// Same-origin paths only (no open redirect via a tampered value).
		const back = sessionStorage.getItem(RETURN_KEY);
		return back?.startsWith("/") && !back.startsWith("//") ? back : "/";
	} catch {
		return "/";
	}
}

/** The only sign-in: Google, for students and the admin alike. */
export default function GoogleSigninDialog({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const [loading, setLoading] = useState(false);

	// Mounted on every page (in the header): shows a failed sign-in's message
	// once, as a toast that fades out by itself.
	useEffect(() => {
		try {
			const message = sessionStorage.getItem(ERROR_KEY);
			if (!message) return;
			sessionStorage.removeItem(ERROR_KEY);
			toast.error(message);
		} catch {
			// Storage blocked: no message to show.
		}
	}, []);

	return (
		<AppDialog
			open={open}
			onClose={onClose}
			title='تسجيل الدخول'
			busy={loading}
		>
			<Stack
				alignItems='center'
				spacing={2.5}
				sx={{ pb: 2, textAlign: "center" }}
			>
				<Image
					src='/images/logo/logo.svg'
					unoptimized
					alt='شعار محمد صبح للفيزياء'
					width={64}
					height={64}
				/>
				<Typography variant='body2' sx={{ color: "text.secondary" }}>
					سجّل دخولك لتحفظ تقدّمك في الشروحات وتكمل كل فيديو من حيث توقفت.
				</Typography>
				<Button
					variant='outlined'
					size='large'
					fullWidth
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : <GoogleLogo />}
					onClick={() => {
						setLoading(true);
						signInWithGoogle();
					}}
					sx={{
						py: 1.25,
						color: "#1f1f1f",
						backgroundColor: "#fff",
						borderColor: "#dadce0",
						fontWeight: 600,
						"&:hover": { backgroundColor: "#f8f9fa", borderColor: "#d2d3d6" },
					}}
				>
					المتابعة باستخدام Google
				</Button>
			</Stack>
		</AppDialog>
	);
}
