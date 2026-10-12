"use client";
import { stashSigninError } from "@/components/Auth/GoogleSigninDialog";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Sends the student back to where they started; that page shows the toast. */
export default function SigninErrorRedirect({ code }: { code: string | null }) {
	const router = useRouter();

	useEffect(() => {
		router.replace(stashSigninError(code));
	}, [code, router]);

	return (
		<Box sx={{ display: "grid", placeItems: "center", minHeight: "50vh" }}>
			<CircularProgress aria-label='جارٍ الرجوع' />
		</Box>
	);
}
