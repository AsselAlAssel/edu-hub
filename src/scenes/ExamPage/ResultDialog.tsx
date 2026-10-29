"use client";
import AppDialog from "@/components/ui/AppDialog";
import {
	Box,
	Button,
	CircularProgress,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";

/** Feedback by score: [minimum percent, message, tone]. */
const LEVELS = [
	[90, "ممتاز! أداء رائع", "success"],
	[75, "جيد جداً، قريب من العلامة الكاملة", "success"],
	[50, "جيد، راجع الأسئلة الخاطئة", "warning"],
	[0, "تحتاج مراجعة، حاول مرة أخرى", "error"],
] as const;

/** Shown once right after submitting: the score, then the review behind it. */
export default function ResultDialog({
	open,
	result,
	backHref,
	onClose,
}: {
	open: boolean;
	result: { correct: number; total: number };
	backHref: string;
	onClose: () => void;
}) {
	const percent = result.total
		? Math.round((result.correct / result.total) * 100)
		: 0;
	const [, message, tone] = LEVELS.find(([min]) => percent >= min)!;

	return (
		<AppDialog
			open={open}
			onClose={onClose}
			title='نتيجة الامتحان'
			fullScreenOnMobile={false}
			actions={
				<>
					<Button size='small' component={Link} href={backHref}>
						رجوع للمجلد
					</Button>
					<Button size='small' variant='contained' onClick={onClose}>
						راجع إجاباتك
					</Button>
				</>
			}
		>
			<Stack alignItems='center' spacing={1.5} sx={{ py: 1 }}>
				<Box sx={{ position: "relative", display: "inline-flex" }}>
					{/* Track ring under the score ring. */}
					<CircularProgress
						variant='determinate'
						value={100}
						size={112}
						thickness={4}
						sx={{ color: "action.hover", position: "absolute" }}
						aria-hidden
					/>
					<CircularProgress
						variant='determinate'
						value={percent}
						size={112}
						thickness={4}
						color={tone}
						aria-label={`النسبة ${percent}%`}
					/>
					<Typography
						sx={{
							position: "absolute",
							inset: 0,
							display: "grid",
							placeItems: "center",
							fontSize: "1.6rem",
							fontWeight: 800,
						}}
					>
						{percent}%
					</Typography>
				</Box>
				<Typography sx={{ fontWeight: 800, fontSize: "1.25rem" }}>
					{result.correct} من {result.total} صحيحة
				</Typography>
				<Typography sx={{ color: `${tone}.main`, fontWeight: 600 }}>
					{message}
				</Typography>
				<Typography
					variant='body2'
					sx={{ color: "text.secondary", textAlign: "center" }}
				>
					حُفظت نتيجتك، ويمكنك إعادة الامتحان متى شئت.
				</Typography>
			</Stack>
		</AppDialog>
	);
}
