"use client";
import AppDialog from "@/components/ui/AppDialog";
import {
	GhostButton,
	IconAction,
	SecondaryButton,
} from "@/components/ui/buttons";
import FormField from "@/components/ui/FormField";
import { getErrorMessage } from "@/libs/errors";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Autocomplete,
	Box,
	Checkbox,
	Chip,
	CircularProgress,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR, { preload } from "swr";
import {
	type Exam,
	fetcher,
	type FolderOption,
	idsKey,
	lessonKey,
	LESSONS_KEY,
	type LessonSummary,
	type Question,
	UNLOCK_RULES,
	type UnlockRule,
} from "./api";

/** Checkboxes for one lesson's questions; fetched when the lesson opens. */
function LessonQuestions({
	lesson,
	isSelected,
	onToggle,
}: {
	lesson: string;
	isSelected: (id: string) => boolean;
	onToggle: (questions: Question[], on: boolean) => void;
}) {
	const { data } = useSWR(lessonKey(lesson), fetcher<Question[]>);
	if (!data) return <Skeleton variant='rounded' height={80} />;
	return (
		<Stack spacing={0.5}>
			{data.map((q) => (
				<FormControlLabel
					key={q.id}
					sx={{ alignItems: "flex-start", m: 0 }}
					control={
						<Checkbox
							size='small'
							checked={isSelected(q.id)}
							onChange={(e) => onToggle([q], e.target.checked)}
						/>
					}
					label={
						<Typography
							variant='body2'
							component='span'
							sx={{ display: "block", pt: 1 }}
						>
							{q.text}
							{q.image ? (
								<Chip
									size='small'
									color='info'
									variant='outlined'
									label='رسم'
									sx={{ ms: 1 }}
								/>
							) : null}
						</Typography>
					}
				/>
			))}
		</Stack>
	);
}

export default function ExamDialog({
	exam,
	folders,
	folderId: fixedFolderId,
	onClose,
	onSaved,
}: {
	/** null = a new exam. */
	exam: Exam | null;
	onClose: () => void;
	onSaved: () => void;
} & (
	| { folders: FolderOption[]; folderId?: never }
	/** Opened from a folder page: the exam belongs to that folder, no picker. */
	| { folders?: never; folderId: string }
)) {
	const { data: lessons = [] } = useSWR(LESSONS_KEY, fetcher<LessonSummary[]>);
	const [title, setTitle] = useState(exam?.title ?? "");
	const [folderId, setFolderId] = useState(
		exam?.folderId ?? fixedFolderId ?? ""
	);
	const [unlockRule, setUnlockRule] = useState(
		(exam?.unlockRule ?? "ALWAYS") as UnlockRule
	);
	// Ordered: students get the questions in this order. null until an edited exam's questions load.
	const [selected, setSelected] = useState<Question[] | null>(exam ? null : []);
	const [expanded, setExpanded] = useState<string | false>(false);
	const [loadingLesson, setLoadingLesson] = useState<string | null>(null);
	const [saving, setSaving] = useState(false);

	const { data: initial } = useSWR(
		exam?.questionIds.length ? idsKey(exam.questionIds) : null,
		fetcher<Question[]>
	);
	useEffect(() => {
		if (exam && !exam.questionIds.length) setSelected([]);
		else if (initial) setSelected((current) => current ?? initial);
	}, [exam, initial]);

	const list = selected ?? [];
	const chosen = new Set(list.map((q) => q.id));

	const toggle = (questions: Question[], on: boolean) =>
		setSelected((current) => {
			const base = current ?? [];
			const ids = new Set((on ? base : questions).map((q) => q.id));
			return on
				? [...base, ...questions.filter((q) => !ids.has(q.id))]
				: base.filter((q) => !ids.has(q.id));
		});

	// "Select all" needs the lesson's questions even if it was never opened.
	const toggleLesson = async (lesson: string, on: boolean) => {
		setLoadingLesson(lesson);
		try {
			toggle(await preload(lessonKey(lesson), fetcher<Question[]>), on);
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر تحميل أسئلة الدرس"));
		} finally {
			setLoadingLesson(null);
		}
	};

	const move = (i: number, by: number) =>
		setSelected((current) => {
			const next = [...(current ?? [])];
			[next[i], next[i + by]] = [next[i + by], next[i]];
			return next;
		});

	const save = async () => {
		setSaving(true);
		try {
			const body = {
				title,
				folderId,
				unlockRule,
				questionIds: list.map((q) => q.id),
			};
			if (exam) await axios.patch(`/api/exams/${exam.id}`, body);
			else await axios.post("/api/exams", body);
			toast.success(exam ? "تم تعديل الامتحان" : "تم إنشاء الامتحان");
			onSaved();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حفظ الامتحان"));
		} finally {
			setSaving(false);
		}
	};

	return (
		<AppDialog
			open
			onClose={onClose}
			busy={saving}
			maxWidth='md'
			title={exam ? "تعديل امتحان" : "امتحان جديد"}
			description='اختر المجلد والأسئلة، ورتّبها بالترتيب الذي سيراه الطالب.'
			onSubmit={() => void save()}
			actions={
				<>
					<SecondaryButton onClick={onClose} disabled={saving}>
						إلغاء
					</SecondaryButton>
					<LoadingButton
						type='submit'
						variant='contained'
						loading={saving}
						disabled={!selected}
					>
						حفظ الامتحان
					</LoadingButton>
				</>
			}
		>
			<Stack spacing={2.5}>
				<FormField
					label='عنوان الامتحان'
					required
					placeholder='مثال: امتحان الوحدة الأولى'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<Stack direction={{ xs: "column", sm: "row" }} gap={2}>
					{folders ? (
						<Autocomplete
							fullWidth
							options={folders}
							value={folders.find((f) => f.id === folderId) ?? null}
							onChange={(_, folder) => setFolderId(folder?.id ?? "")}
							noOptionsText='لا توجد مجلدات'
							renderInput={(params) => (
								<FormField {...params} label='المجلد' required />
							)}
						/>
					) : null}
					<FormField
						select
						label='متى يظهر للطالب'
						value={unlockRule}
						onChange={(e) => setUnlockRule(e.target.value as UnlockRule)}
					>
						{Object.entries(UNLOCK_RULES).map(([value, { label }]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</FormField>
				</Stack>

				<Box
					sx={{
						display: "grid",
						gap: 2,
						gridTemplateColumns: {
							xs: "minmax(0, 1fr)",
							md: "repeat(2, minmax(0, 1fr))",
						},
						alignItems: "start",
					}}
				>
					<Box>
						<InputLabel>الأسئلة حسب الدرس</InputLabel>
						{lessons.map(({ lesson, count }) => {
							const picked = list.filter((q) => q.lesson === lesson).length;
							return (
								<Accordion
									key={lesson}
									expanded={expanded === lesson}
									onChange={(_, open) => setExpanded(open ? lesson : false)}
									TransitionProps={{ unmountOnExit: true }}
								>
									<AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
										<FormControlLabel
											onClick={(e) => e.stopPropagation()}
											onFocus={(e) => e.stopPropagation()}
											sx={{ m: 0 }}
											control={
												loadingLesson === lesson ? (
													<CircularProgress size={20} sx={{ m: 1.25 }} />
												) : (
													<Checkbox
														checked={picked === count}
														indeterminate={picked > 0 && picked < count}
														disabled={!selected}
														onChange={(e) =>
															void toggleLesson(lesson, e.target.checked)
														}
														inputProps={{
															"aria-label": `اختيار كل أسئلة ${lesson}`,
														}}
													/>
												)
											}
											label={
												<Stack direction='row' alignItems='center' gap={1}>
													<Typography sx={{ fontWeight: 600 }}>
														{lesson}
													</Typography>
													<Chip
														size='small'
														color={picked ? "primary" : "default"}
														label={`${picked}/${count}`}
													/>
												</Stack>
											}
										/>
									</AccordionSummary>
									<AccordionDetails sx={{ maxHeight: 360, overflowY: "auto" }}>
										<LessonQuestions
											lesson={lesson}
											isSelected={(id) => chosen.has(id)}
											onToggle={toggle}
										/>
									</AccordionDetails>
								</Accordion>
							);
						})}
					</Box>

					<Box>
						<Stack
							direction='row'
							alignItems='center'
							justifyContent='space-between'
						>
							<InputLabel>ترتيب الأسئلة ({list.length})</InputLabel>
							{list.length ? (
								<GhostButton
									size='small'
									color='error'
									onClick={() => setSelected([])}
								>
									إزالة الكل
								</GhostButton>
							) : null}
						</Stack>
						{!selected ? (
							<Skeleton variant='rounded' height={200} />
						) : !list.length ? (
							<Typography
								variant='body2'
								sx={{ color: "text.secondary", py: 2 }}
							>
								لم تختر أي سؤال بعد. افتح درساً واختر أسئلته، أو اختر الدرس
								كاملاً.
							</Typography>
						) : (
							<Stack
								component='ol'
								spacing={0.75}
								sx={{ m: 0, p: 0, maxHeight: 520, overflowY: "auto" }}
							>
								{list.map((q, i) => (
									<Stack
										component='li'
										key={q.id}
										direction='row'
										alignItems='center'
										gap={0.5}
										sx={{
											listStyle: "none",
											p: 1,
											borderRadius: 2,
											border: 1,
											borderColor: "divider",
										}}
									>
										<Chip size='small' color='primary' label={i + 1} />
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography variant='body2' noWrap>
												{q.text}
											</Typography>
											<Typography
												variant='caption'
												sx={{ color: "text.secondary" }}
											>
												{q.lesson}
											</Typography>
										</Box>
										<IconAction
											label='تحريك لأعلى'
											size='small'
											disabled={i === 0}
											onClick={() => move(i, -1)}
										>
											<ArrowUpwardRoundedIcon fontSize='small' />
										</IconAction>
										<IconAction
											label='تحريك لأسفل'
											size='small'
											disabled={i === list.length - 1}
											onClick={() => move(i, 1)}
										>
											<ArrowDownwardRoundedIcon fontSize='small' />
										</IconAction>
										<IconAction
											label='إزالة من الامتحان'
											size='small'
											onClick={() => toggle([q], false)}
											sx={{ color: "error.main" }}
										>
											<CloseRoundedIcon fontSize='small' />
										</IconAction>
									</Stack>
								))}
							</Stack>
						)}
					</Box>
				</Box>
			</Stack>
		</AppDialog>
	);
}
