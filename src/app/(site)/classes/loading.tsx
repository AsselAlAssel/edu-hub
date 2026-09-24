import { PageShell } from "@/components/ui/PageShell";
import { CardGridSkeleton } from "@/components/ui/Skeletons";
import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
	return (
		<PageShell>
			<Stack
				spacing={1.5}
				sx={{ mb: 5 }}
				role='status'
				aria-label='جارٍ تحميل الصفوف'
			>
				<Skeleton variant='text' width={120} />
				<Skeleton variant='text' width='40%' height={56} />
				<Skeleton variant='text' width='60%' />
			</Stack>
			<CardGridSkeleton />
		</PageShell>
	);
}
