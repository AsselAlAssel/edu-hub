import { PageShell } from "@/components/ui/PageShell";
import { ResourcesSkeleton } from "@/components/ui/Skeletons";
import { Skeleton, Stack } from "@mui/material";

export default function Loading() {
	return (
		<PageShell>
			<Stack
				spacing={1.5}
				sx={{ mb: 5 }}
				role='status'
				aria-label='جارٍ تحميل المحتوى'
			>
				<Skeleton variant='text' width={220} />
				<Skeleton variant='text' width='35%' height={56} />
			</Stack>
			<ResourcesSkeleton />
		</PageShell>
	);
}
