"use client";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { SearchField } from "@/components/ui/FormField";
import { EmptyState, ErrorState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { getErrorMessage } from "@/libs/errors";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import TouchAppOutlinedIcon from "@mui/icons-material/TouchAppOutlined";
import {
	Box,
	Button,
	Chip,
	Skeleton,
	Stack,
	Tab,
	Tabs,
	type Theme,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR, { useSWRConfig } from "swr";
import {
	fetcher,
	isExamsKey,
	lessonKey,
	type LessonSummary,
	type Question,
	searchKey,
} from "./api";
import QuestionCard from "./QuestionCard";
import QuestionDialog from "./QuestionDialog";

const SEARCH_DELAY_MS = 300;

/** Waits until typing pauses before the value is used for a request. */
function useDebounced(value: string, delay: number) {
	const [debounced, setDebounced] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timer);
	}, [value, delay]);
	return debounced;
}

/** A list of questions fetched from `url`; mounted only when it is on screen. */
function QuestionList({
	url,
	onEdit,
	onDelete,
}: {
	url: string;
	onEdit: (q: Question) => void;
	onDelete: (q: Question) => void;
}) {
	const { data, error, mutate } = useSWR(url, fetcher<Question[]>);

	if (error)
		return (
			<ErrorState
				compact
				action={<Button onClick={() => void mutate()}>إعادة المحاولة</Button>}
			/>
		);
	if (!data)
		return (
			<Stack spacing={1.5}>
				{[0, 1].map((i) => (
					<Skeleton key={i} variant='rounded' height={150} />
				))}
			</Stack>
		);
	if (!data.length) return <EmptyState compact title='لا توجد أسئلة مطابقة' />;
	return (
		<Stack component='ol' spacing={1.5} sx={{ m: 0, p: 0 }}>
			{data.map((q, i) => (
				<QuestionCard
					key={q.id}
					question={q}
					number={i + 1}
					onEdit={() => onEdit(q)}
					onDelete={() => onDelete(q)}
				/>
			))}
		</Stack>
	);
}

export default function QuestionBank({
	lessons,
}: {
	lessons: LessonSummary[];
}) {
	const { mutate } = useSWRConfig();
	const [search, setSearch] = useState("");
	const query = useDebounced(search.trim(), SEARCH_DELAY_MS);
	const [picked, setPicked] = useState<string>();
	// Nothing is open until the admin picks a lesson (or after it is deleted).
	const active = lessons.some((l) => l.lesson === picked) ? picked : undefined;
	const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));
	// undefined = closed, null = new question.
	const [editing, setEditing] = useState<Question | null>();
	const [toDelete, setToDelete] = useState<Question | null>(null);
	const [deleting, setDeleting] = useState(false);
	const lessonNames = lessons.map((l) => l.lesson);

	const refresh = () => mutate(isExamsKey);

	const confirmDelete = async () => {
		if (!toDelete) return;
		setDeleting(true);
		try {
			await axios.delete(`/api/exams/questions/${toDelete.id}`);
			toast.success("تم حذف السؤال");
			setToDelete(null);
			await refresh();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حذف السؤال"));
		} finally {
			setDeleting(false);
		}
	};

	const listProps = { onEdit: setEditing, onDelete: setToDelete };

	return (
		<Stack spacing={2}>
			<Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
				<SearchField
					label='ابحث في نص السؤال أو المصدر'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
				/>
				<Button
					variant='contained'
					startIcon={<AddRoundedIcon />}
					onClick={() => setEditing(null)}
					sx={{ flexShrink: 0 }}
				>
					سؤال جديد
				</Button>
			</Stack>

			{!lessons.length ? (
				<EmptyState
					title='بنك الأسئلة فارغ'
					description='ابدأ بإضافة أول سؤال وحدّد الدرس الذي ينتمي إليه.'
				/>
			) : (
				<Box
					sx={{
						display: "grid",
						gap: 2,
						alignItems: "start",
						gridTemplateColumns: {
							xs: "minmax(0, 1fr)",
							md: "260px minmax(0, 1fr)",
						},
					}}
				>
					<Surface
						sx={{
							p: 1,
							// Stays in view while the questions scroll; scrolls itself when lessons overflow.
							position: { md: "sticky" },
							top: { md: 96 },
						}}
					>
						<Tabs
							orientation={wide ? "vertical" : "horizontal"}
							variant='scrollable'
							allowScrollButtonsMobile
							// false = no lesson highlighted (nothing picked yet, or searching).
							value={!query && active ? active : false}
							onChange={(_, lesson: string) => {
								setPicked(lesson);
								setSearch("");
							}}
							aria-label='الدروس'
							TabIndicatorProps={{ sx: { display: "none" } }}
							sx={{ maxHeight: { md: "calc(100vh - 140px)" }, minHeight: 0 }}
						>
							{lessons.map(({ lesson, count, withImages }) => (
								<Tab
									key={lesson}
									value={lesson}
									id={`lesson-tab-${lesson}`}
									aria-controls='lesson-panel'
									sx={(theme) => ({
										minHeight: 0,
										maxWidth: "none",
										px: 1.5,
										py: 1,
										mb: { md: 0.5 },
										borderRadius: `${theme.tokens.radii.md}px`,
										alignItems: "stretch",
										textAlign: "start",
										color: "text.primary",
										"&:hover": { bgcolor: "action.hover" },
										"&.Mui-selected": {
											color: "primary.main",
											bgcolor: alpha(theme.palette.primary.main, 0.12),
										},
									})}
									label={
										<Stack direction='row' alignItems='center' gap={0.75}>
											<Typography
												variant='body2'
												sx={{ fontWeight: 700, flex: 1, minWidth: 0 }}
											>
												{lesson}
											</Typography>
											{withImages ? (
												<Chip
													size='small'
													color='info'
													variant='outlined'
													icon={<ImageOutlinedIcon />}
													label={withImages}
													aria-label={`${withImages} مع رسومات`}
													sx={{ height: 22 }}
												/>
											) : null}
											<Chip
												size='small'
												color='primary'
												label={count}
												aria-label={`${count} سؤال`}
												sx={{ height: 22 }}
											/>
										</Stack>
									}
								/>
							))}
						</Tabs>
					</Surface>
					<Box
						role='tabpanel'
						id='lesson-panel'
						aria-labelledby={active ? `lesson-tab-${active}` : undefined}
					>
						{/* Only the open lesson's (or the search's) questions are fetched. */}
						{query ? (
							<QuestionList url={searchKey(query)} {...listProps} />
						) : active ? (
							<QuestionList url={lessonKey(active)} {...listProps} />
						) : (
							<EmptyState
								icon={<TouchAppOutlinedIcon />}
								title='اختر درساً'
								description='اضغط على أي درس من القائمة لعرض أسئلته.'
							/>
						)}
					</Box>
				</Box>
			)}

			{editing !== undefined ? (
				<QuestionDialog
					question={editing}
					defaultLesson={active}
					lessons={lessonNames}
					onClose={() => setEditing(undefined)}
					onSaved={() => {
						setEditing(undefined);
						void refresh();
					}}
				/>
			) : null}
			<ConfirmDialog
				open={!!toDelete}
				title='حذف السؤال'
				description='سيُحذف السؤال ورسمه نهائياً، ويُزال من كل الامتحانات التي تستخدمه.'
				loading={deleting}
				onConfirm={confirmDelete}
				onClose={() => setToDelete(null)}
			/>
		</Stack>
	);
}
