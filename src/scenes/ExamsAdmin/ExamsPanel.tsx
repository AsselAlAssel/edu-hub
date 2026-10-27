"use client";
import { IconAction } from "@/components/ui/buttons";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import IconTile from "@/components/ui/IconTile";
import { EmptyState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { getErrorMessage } from "@/libs/errors";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSWRConfig } from "swr";
import {
	type Exam,
	type ExamsResponse,
	isExamsKey,
	type LessonSummary,
	UNLOCK_RULES,
	type UnlockRule,
} from "./api";
import ExamDialog from "./ExamDialog";

export default function ExamsPanel({
	data,
	lessons,
}: {
	data: ExamsResponse;
	lessons: LessonSummary[];
}) {
	const { mutate } = useSWRConfig();
	// undefined = closed, null = new exam.
	const [editing, setEditing] = useState<Exam | null>();
	const [toDelete, setToDelete] = useState<Exam | null>(null);
	const [deleting, setDeleting] = useState(false);
	const folderLabels = new Map(data.folders.map((f) => [f.id, f.label]));

	const confirmDelete = async () => {
		if (!toDelete) return;
		setDeleting(true);
		try {
			await axios.delete(`/api/exams/${toDelete.id}`);
			toast.success("تم حذف الامتحان");
			setToDelete(null);
			await mutate(isExamsKey);
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حذف الامتحان"));
		} finally {
			setDeleting(false);
		}
	};

	const newButton = (
		<Button
			variant='contained'
			startIcon={<AddRoundedIcon />}
			onClick={() => setEditing(null)}
			disabled={!lessons.length}
		>
			امتحان جديد
		</Button>
	);

	return (
		<Stack spacing={2}>
			{data.exams.length ? (
				<>
					<Box sx={{ alignSelf: "flex-end" }}>{newButton}</Box>
					<Stack component='ul' spacing={1.5} sx={{ m: 0, p: 0 }}>
						{data.exams.map((exam) => {
							const rule =
								UNLOCK_RULES[exam.unlockRule as UnlockRule] ??
								UNLOCK_RULES.ALWAYS;
							return (
								<Surface
									key={exam.id}
									component='li'
									sx={{
										p: 2,
										listStyle: "none",
										display: "flex",
										alignItems: { xs: "flex-start", sm: "center" },
										gap: 1.5,
									}}
								>
									<IconTile tone='secondary' size={44}>
										<QuizOutlinedIcon />
									</IconTile>
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography sx={{ fontWeight: 700 }}>
											{exam.title}
										</Typography>
										<Stack
											direction='row'
											gap={0.75}
											flexWrap='wrap'
											sx={{ mt: 0.75 }}
										>
											<Chip
												size='small'
												variant='outlined'
												icon={<FolderOutlinedIcon />}
												label={folderLabels.get(exam.folderId) ?? "مجلد محذوف"}
												color={
													folderLabels.has(exam.folderId) ? "default" : "error"
												}
											/>
											<Chip
												size='small'
												color='primary'
												label={`${exam.questionIds.length} سؤال`}
											/>
											<Chip
												size='small'
												color={rule.color}
												variant='outlined'
												label={rule.label}
											/>
										</Stack>
									</Box>
									<IconAction
										label={`تعديل ${exam.title}`}
										onClick={() => setEditing(exam)}
										sx={{ color: "primary.main" }}
									>
										<EditOutlinedIcon />
									</IconAction>
									<IconAction
										label={`حذف ${exam.title}`}
										onClick={() => setToDelete(exam)}
										sx={{ color: "error.main" }}
									>
										<DeleteOutlineRoundedIcon />
									</IconAction>
								</Surface>
							);
						})}
					</Stack>
				</>
			) : (
				<EmptyState
					icon={<QuizOutlinedIcon />}
					title='لا توجد امتحانات بعد'
					description='أنشئ امتحاناً، اربطه بمجلد واختر أسئلته من بنك الأسئلة.'
					action={newButton}
				/>
			)}

			{editing !== undefined ? (
				<ExamDialog
					exam={editing}
					folders={data.folders}
					onClose={() => setEditing(undefined)}
					onSaved={() => {
						setEditing(undefined);
						void mutate(isExamsKey);
					}}
				/>
			) : null}
			<ConfirmDialog
				open={!!toDelete}
				title='حذف الامتحان'
				description={`سيُحذف امتحان "${toDelete?.title ?? ""}". الأسئلة تبقى في البنك.`}
				loading={deleting}
				onConfirm={confirmDelete}
				onClose={() => setToDelete(null)}
			/>
		</Stack>
	);
}
