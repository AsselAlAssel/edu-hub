"use client";
import { signInWithGoogle } from "@/components/Auth/GoogleSigninDialog";
import { IconAction } from "@/components/ui/buttons";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import IconTile from "@/components/ui/IconTile";
import { EmptyState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import {
	folderExamsKey,
	UNLOCK_RULES,
	type UnlockRule,
} from "@/constants/exams";
import type { ExamStatus } from "@/libs/examAccess";
import type { AttemptScore } from "@/libs/exams";
import { getErrorMessage } from "@/libs/errors";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import {
	Badge,
	Box,
	Button,
	Chip,
	Drawer,
	LinearProgress,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import type { Exam } from "@prisma/client";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";

const ExamDialog = dynamic(() => import("@/scenes/ExamsAdmin/ExamDialog"), {
	ssr: false,
});

type FolderExam = {
	id: string;
	title: string;
	questionCount: number;
	unlockRule: string;
	status: ExamStatus;
	/** The viewer's own attempts, or null before the first one. */
	results: {
		count: number;
		last: AttemptScore;
		best: AttemptScore;
	} | null;
	/** Admins only: the editable record. */
	exam?: Exam;
};

const score = ({ correct, total }: AttemptScore) => `${correct}/${total}`;

const fetchExams = (url: string) =>
	axios.get<FolderExam[]>(url).then((res) => res.data);

/** What a student sees under a closed exam, and the way to open it. */
function ExamAction({
	item,
	onSubscribe,
}: {
	item: FolderExam;
	onSubscribe: () => void;
}) {
	const { status, results } = item;
	if (status.state === "open")
		return (
			<Stack spacing={1.25}>
				{results ? (
					<Stack
						direction='row'
						gap={0.75}
						flexWrap='wrap'
						aria-label='نتائجك السابقة'
					>
						<Chip
							size='small'
							color='success'
							icon={<EmojiEventsOutlinedIcon />}
							label={`أفضل نتيجة ${score(results.best)}`}
						/>
						<Chip
							size='small'
							variant='outlined'
							label={`آخر نتيجة ${score(results.last)}`}
						/>
						<Chip
							size='small'
							variant='outlined'
							label={`${results.count} ${results.count === 1 ? "محاولة" : "محاولات"}`}
						/>
					</Stack>
				) : null}
				<Button
					component={Link}
					href={`/exam/${item.id}`}
					variant={results ? "outlined" : "contained"}
					fullWidth
					startIcon={results ? <ReplayRoundedIcon /> : <PlayArrowRoundedIcon />}
				>
					{results ? "أعد الامتحان" : "ابدأ الامتحان"}
				</Button>
			</Stack>
		);
	if (status.state === "signin")
		return (
			<Button variant='outlined' fullWidth onClick={signInWithGoogle}>
				سجّل الدخول لتقديم الامتحان
			</Button>
		);
	if (status.state === "paid")
		return (
			<Button
				variant='outlined'
				color='warning'
				fullWidth
				startIcon={<LockOutlinedIcon />}
				onClick={onSubscribe}
			>
				اشترك في الوحدة لفتح الامتحان
			</Button>
		);
	return (
		<Box>
			<Stack direction='row' justifyContent='space-between' sx={{ mb: 0.75 }}>
				<Typography variant='body2' sx={{ color: "text.secondary" }}>
					<LockOutlinedIcon
						fontSize='inherit'
						sx={{ verticalAlign: "middle", me: 0.5 }}
					/>
					يفتح بعد مشاهدة الفيديوهات
				</Typography>
				<Typography variant='body2' sx={{ fontWeight: 700 }}>
					{status.done}/{status.total}
				</Typography>
			</Stack>
			<LinearProgress
				variant='determinate'
				value={(status.done / status.total) * 100}
				sx={{ height: 6, borderRadius: 3 }}
				aria-label='تقدّمك في الفيديوهات'
			/>
		</Box>
	);
}

/**
 * Header button + side panel with the folder's exams. Students start an exam
 * (or see what still locks it); admins also add, edit and delete them here.
 */
export default function FolderExams({
	folderId,
	folderName,
	isAdmin,
	onSubscribe,
}: {
	folderId: string;
	folderName: string;
	isAdmin: boolean;
	onSubscribe: () => void;
}) {
	const key = folderExamsKey(folderId);
	const { data, mutate } = useSWR(key, fetchExams);
	const [open, setOpen] = useState(false);
	// undefined = closed, null = new exam.
	const [editing, setEditing] = useState<Exam | null>();
	const [toDelete, setToDelete] = useState<FolderExam | null>(null);
	const [deleting, setDeleting] = useState(false);

	// Students only see the button when the folder has exams.
	if (!isAdmin && !data?.length) return null;

	const confirmDelete = async () => {
		if (!toDelete) return;
		setDeleting(true);
		try {
			await axios.delete(`/api/exams/${toDelete.id}`);
			toast.success("تم حذف الامتحان");
			setToDelete(null);
			await mutate();
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر حذف الامتحان"));
		} finally {
			setDeleting(false);
		}
	};

	return (
		<>
			<Badge badgeContent={data?.length} color='secondary'>
				<Button
					variant='outlined'
					startIcon={<QuizOutlinedIcon />}
					onClick={() => setOpen(true)}
				>
					الامتحانات
				</Button>
			</Badge>

			<Drawer
				// RTL flips this: the panel slides in from the right (start) edge.
				anchor='left'
				open={open}
				onClose={() => setOpen(false)}
				PaperProps={{
					sx: { width: { xs: "100%", sm: 400 }, p: 2.5, gap: 2 },
					// A modal panel: announced as a dialog, like the app's others.
					role: "dialog",
					"aria-modal": true,
					"aria-label": "امتحانات المجلد",
				}}
			>
				<Stack direction='row' alignItems='center' gap={1}>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography variant='h6' sx={{ fontWeight: 800 }}>
							الامتحانات
						</Typography>
						<Typography variant='body2' sx={{ color: "text.secondary" }} noWrap>
							{folderName}
						</Typography>
					</Box>
					<IconAction label='إغلاق' onClick={() => setOpen(false)}>
						<CloseRoundedIcon />
					</IconAction>
				</Stack>

				{isAdmin ? (
					<Button
						variant='contained'
						startIcon={<AddRoundedIcon />}
						onClick={() => setEditing(null)}
					>
						امتحان جديد لهذا المجلد
					</Button>
				) : null}

				{!data ? (
					<Skeleton variant='rounded' height={140} />
				) : !data.length ? (
					<EmptyState
						compact
						icon={<QuizOutlinedIcon />}
						title='لا توجد امتحانات هنا'
						description='أضف امتحاناً واختر أسئلته من بنك الأسئلة.'
					/>
				) : (
					<Stack component='ul' spacing={1.5} sx={{ m: 0, p: 0 }}>
						{data.map((item) => {
							const rule =
								UNLOCK_RULES[item.unlockRule as UnlockRule] ??
								UNLOCK_RULES.ALWAYS;
							return (
								<Surface
									key={item.id}
									component='li'
									sx={{ p: 2, listStyle: "none" }}
								>
									<Stack direction='row' gap={1.5} alignItems='flex-start'>
										<IconTile tone='secondary' size={40}>
											<QuizOutlinedIcon />
										</IconTile>
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography sx={{ fontWeight: 700 }}>
												{item.title}
											</Typography>
											<Stack
												direction='row'
												gap={0.75}
												flexWrap='wrap'
												sx={{ mt: 0.5 }}
											>
												<Chip
													size='small'
													color='primary'
													label={`${item.questionCount} سؤال`}
												/>
												{isAdmin ? (
													<Chip
														size='small'
														variant='outlined'
														color={rule.color}
														label={rule.label}
													/>
												) : null}
											</Stack>
										</Box>
										{isAdmin && item.exam ? (
											<>
												<IconAction
													label={`تعديل ${item.title}`}
													onClick={() => setEditing(item.exam)}
													sx={{ color: "primary.main" }}
												>
													<EditOutlinedIcon />
												</IconAction>
												<IconAction
													label={`حذف ${item.title}`}
													onClick={() => setToDelete(item)}
													sx={{ color: "error.main" }}
												>
													<DeleteOutlineRoundedIcon />
												</IconAction>
											</>
										) : null}
									</Stack>
									<Box sx={{ mt: 1.5 }}>
										<ExamAction item={item} onSubscribe={onSubscribe} />
									</Box>
								</Surface>
							);
						})}
					</Stack>
				)}
			</Drawer>

			{isAdmin && editing !== undefined ? (
				<ExamDialog
					exam={editing}
					folderId={folderId}
					onClose={() => setEditing(undefined)}
					onSaved={() => {
						setEditing(undefined);
						void mutate();
					}}
				/>
			) : null}
			{isAdmin ? (
				<ConfirmDialog
					open={!!toDelete}
					title='حذف الامتحان'
					description={`سيُحذف امتحان "${toDelete?.title ?? ""}". الأسئلة تبقى في البنك.`}
					loading={deleting}
					onConfirm={confirmDelete}
					onClose={() => setToDelete(null)}
				/>
			) : null}
		</>
	);
}
