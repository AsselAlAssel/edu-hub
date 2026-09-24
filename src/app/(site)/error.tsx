"use client";
import { PageShell } from "@/components/ui/PageShell";
import { ErrorState } from "@/components/ui/States";
import { Box, Button, Stack } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

/** Route-segment error boundary for every public page. */
export default function SiteError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<PageShell>
			<ErrorState
				title='تعذّر عرض هذه الصفحة'
				description={
					<>
						حدث خطأ أثناء تحميل المحتوى. يمكنك المحاولة مجدداً أو العودة
						للرئيسية.
						{/* Development only: the real cause, so it can be diagnosed. */}
						{process.env.NODE_ENV === "development" ? (
							<Box
								component='code'
								dir='ltr'
								sx={{
									display: "block",
									mt: 2,
									p: 1.5,
									borderRadius: 1,
									textAlign: "left",
									fontSize: "0.8125rem",
									whiteSpace: "pre-wrap",
									overflowWrap: "anywhere",
									color: "error.main",
									bgcolor: "action.hover",
								}}
							>
								{error.name}: {error.message}
							</Box>
						) : null}
					</>
				}
				action={
					<Stack direction='row' gap={1.5}>
						<Button onClick={reset}>إعادة المحاولة</Button>
						<Button component={Link} href='/' variant='outlined'>
							الصفحة الرئيسية
						</Button>
					</Stack>
				}
			/>
		</PageShell>
	);
}
