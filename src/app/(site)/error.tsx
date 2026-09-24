"use client";
import { PageShell } from "@/components/ui/PageShell";
import { ErrorState } from "@/components/ui/States";
import { Button, Stack } from "@mui/material";
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
				description='حدث خطأ أثناء تحميل المحتوى. يمكنك المحاولة مجدداً أو العودة للرئيسية.'
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
