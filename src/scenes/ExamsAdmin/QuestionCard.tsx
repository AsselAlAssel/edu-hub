"use client";
import { IconAction } from "@/components/ui/buttons";
import Surface from "@/components/ui/Surface";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Box, Chip, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { LETTERS, type Question } from "./api";

/** One bank question: text, drawing, every option with the correct one marked. */
export default function QuestionCard({
	question: q,
	number,
	onEdit,
	onDelete,
}: {
	question: Question;
	number: number;
	onEdit: () => void;
	onDelete: () => void;
}) {
	return (
		<Surface component='li' sx={{ p: { xs: 1.5, sm: 2 }, listStyle: "none" }}>
			<Stack direction='row' alignItems='center' gap={1} flexWrap='wrap'>
				<Chip size='small' color='primary' label={`سؤال ${number}`} />
				{q.source ? (
					<Chip
						size='small'
						variant='outlined'
						color='secondary'
						label={q.source}
					/>
				) : null}
				<Box sx={{ flex: 1 }} />
				<IconAction
					label='تعديل السؤال'
					onClick={onEdit}
					sx={{ color: "primary.main" }}
				>
					<EditOutlinedIcon />
				</IconAction>
				<IconAction
					label='حذف السؤال'
					onClick={onDelete}
					sx={{ color: "error.main" }}
				>
					<DeleteOutlineRoundedIcon />
				</IconAction>
			</Stack>

			<Typography
				sx={{ mt: 1, fontWeight: 600, whiteSpace: "pre-wrap", lineHeight: 1.9 }}
			>
				{q.text}
			</Typography>

			{q.image ? (
				<Box
					component='img'
					src={q.image}
					alt={`رسم السؤال ${number}`}
					loading='lazy'
					sx={{
						display: "block",
						mt: 1.5,
						maxWidth: "100%",
						maxHeight: 240,
						borderRadius: 2,
						border: 1,
						borderColor: "divider",
						// Drawings are scanned on white; keep them readable in dark mode.
						bgcolor: "common.white",
					}}
				/>
			) : null}

			<Box
				component='ol'
				sx={{
					m: 0,
					mt: 1.5,
					p: 0,
					display: "grid",
					gap: 1,
					gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
				}}
			>
				{q.options.map((option, i) => {
					const correct = i === q.correctIndex;
					return (
						<Box
							component='li'
							key={i}
							sx={(theme) => ({
								listStyle: "none",
								display: "flex",
								alignItems: "center",
								gap: 1,
								px: 1.5,
								py: 1,
								borderRadius: 2,
								border: 1,
								borderColor: correct ? "success.main" : "divider",
								bgcolor: correct
									? alpha(theme.palette.success.main, 0.1)
									: "transparent",
								fontWeight: correct ? 700 : 400,
							})}
						>
							<Box
								aria-hidden
								sx={{
									width: 26,
									height: 26,
									flexShrink: 0,
									display: "grid",
									placeItems: "center",
									borderRadius: "50%",
									fontSize: 13,
									fontWeight: 700,
									color: correct ? "success.contrastText" : "text.secondary",
									bgcolor: correct ? "success.main" : "action.hover",
								}}
							>
								{LETTERS[i]}
							</Box>
							<Box sx={{ flex: 1, minWidth: 0 }}>{option}</Box>
							{correct ? (
								<CheckCircleRoundedIcon
									color='success'
									fontSize='small'
									titleAccess='الإجابة الصحيحة'
								/>
							) : null}
						</Box>
					);
				})}
			</Box>
		</Surface>
	);
}
