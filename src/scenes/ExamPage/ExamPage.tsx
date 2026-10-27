"use client";
import PageContainer from "@/components/PageContainer";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import Surface from "@/components/ui/Surface";
import { getErrorMessage } from "@/libs/errors";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import LoadingButton from "@mui/lab/LoadingButton";
import {
	Box,
	Button,
	Chip,
	LinearProgress,
	Skeleton,
	Stack,
	Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { rangeToLoad } from "./questionWindow";
import ResultDialog from "./ResultDialog";

/** A question as students get it: no answer key. */
type StudentQuestion = {
	id: string;
	lesson: string;
	text: string;
	image: string | null;
	source: string | null;
	options: string[];
};
type Result = { correct: number; total: number; key: Record<string, number> };
type Tone = "primary" | "success" | "error";

const LETTERS = ["أ", "ب", "ج", "د", "هـ", "و"];

/** One option: a big tappable row, like circling a letter on paper. */
function Option({
	name,
	letter,
	text,
	chosen,
	tone,
	locked,
	onChoose,
}: {
	name: string;
	letter: string;
	text: string;
	chosen: boolean;
	tone: Tone | null;
	locked: boolean;
	onChoose: () => void;
}) {
	return (
		<Box
			component='label'
			sx={(theme) => ({
				position: "relative",
				display: "flex",
				alignItems: "center",
				gap: 2,
				px: 2,
				py: 1.5,
				fontSize: { xs: "1rem", md: "1.125rem" },
				borderRadius: `${theme.tokens.radii.md}px`,
				border: `1.5px solid ${tone ? theme.palette[tone].main : theme.tokens.colors.border}`,
				bgcolor: tone ? alpha(theme.palette[tone].main, 0.08) : "transparent",
				cursor: locked ? "default" : "pointer",
				transition: theme.transitions.create([
					"border-color",
					"background-color",
				]),
				"&:hover": locked ? {} : { borderColor: theme.palette.primary.main },
				"&:focus-within": {
					outline: `2px solid ${theme.palette.primary.main}`,
				},
			})}
		>
			<input
				type='radio'
				name={name}
				checked={chosen}
				disabled={locked}
				onChange={onChoose}
				style={{ position: "absolute", opacity: 0 }}
			/>
			<Box
				aria-hidden
				sx={{
					width: 36,
					height: 36,
					flexShrink: 0,
					display: "grid",
					placeItems: "center",
					borderRadius: "50%",
					border: "2px solid",
					borderColor: tone ? `${tone}.main` : "divider",
					bgcolor: chosen ? `${tone ?? "primary"}.main` : "transparent",
					color: chosen ? "common.white" : "text.primary",
					fontWeight: 700,
				}}
			>
				{letter}
			</Box>
			<Box component='bdi' sx={{ flex: 1 }}>
				{text}
			</Box>
			{tone === "success" ? (
				<CheckCircleRoundedIcon color='success' titleAccess='الإجابة الصحيحة' />
			) : null}
			{tone === "error" ? (
				<CancelRoundedIcon color='error' titleAccess='إجابتك خاطئة' />
			) : null}
		</Box>
	);
}

/**
 * One question per screen with previous/next and a map of question numbers.
 * Questions arrive in small windows (see questionWindow); the server grades
 * and only then sends the answer key, which turns the screen into a review.
 */
export default function ExamPage({
	examId,
	title,
	total,
	backHref,
}: {
	examId: string;
	title: string;
	total: number;
	backHref: string;
}) {
	const [questions, setQuestions] = useState<Record<number, StudentQuestion>>(
		{}
	);
	const [current, setCurrent] = useState(0);
	const [answers, setAnswers] = useState<Record<string, number>>({});
	const [result, setResult] = useState<Result | null>(null);
	const [confirming, setConfirming] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	// Indices loaded or in flight, so a window is never fetched twice.
	const requested = useRef(new Set<number>());

	const load = useCallback(
		async (from: number, to: number) => {
			for (let i = from; i < to; i++) requested.current.add(i);
			try {
				const { data } = await axios.get<StudentQuestion[]>(
					`/api/exams/${examId}/questions`,
					{ params: { offset: from, limit: to - from } }
				);
				setQuestions((prev) => {
					const next = { ...prev };
					data.forEach((q, i) => (next[from + i] = q));
					return next;
				});
			} catch (err) {
				for (let i = from; i < to; i++) requested.current.delete(i);
				toast.error(getErrorMessage(err, "تعذّر تحميل الأسئلة"));
			}
		},
		[examId]
	);

	useEffect(() => {
		const range = rangeToLoad(current, total, (i) => requested.current.has(i));
		if (range) void load(...range);
	}, [current, total, load]);

	const answered = Object.keys(answers).length;
	const unanswered = total - answered;
	const submitted = !!result;
	const question = questions[current];

	// Leaving mid-exam loses the answers: ask first.
	useEffect(() => {
		if (!answered || submitted) return;
		const warn = (event: BeforeUnloadEvent) => event.preventDefault();
		window.addEventListener("beforeunload", warn);
		return () => window.removeEventListener("beforeunload", warn);
	}, [answered, submitted]);

	const submit = async () => {
		setSubmitting(true);
		try {
			const { data } = await axios.post<Result>(`/api/exams/${examId}/submit`, {
				answers,
			});
			setResult(data);
			setShowResult(true);
			setConfirming(false);
			setCurrent(0);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} catch (err) {
			toast.error(getErrorMessage(err, "تعذّر تسليم الامتحان"));
		} finally {
			setSubmitting(false);
		}
	};

	const retry = () => {
		setAnswers({});
		setResult(null);
		setCurrent(0);
	};

	const optionTone = (q: StudentQuestion, index: number): Tone | null => {
		const chosen = answers[q.id] === index;
		if (!result) return chosen ? "primary" : null;
		if (index === result.key[q.id]) return "success";
		return chosen ? "error" : null;
	};

	const mapTone = (index: number): Tone | null => {
		const q = questions[index];
		if (!result) return q && q.id in answers ? "primary" : null;
		// Unloaded questions were never answered.
		return q && answers[q.id] === result.key[q.id] ? "success" : "error";
	};

	return (
		<PageContainer sx={{ py: { xs: 3, md: 4 } }}>
			<Stack
				direction='row'
				alignItems='flex-end'
				justifyContent='space-between'
				gap={2}
				sx={{ mb: 2.5 }}
			>
				<Box sx={{ minWidth: 0 }}>
					<Box
						component={Link}
						href={backHref}
						sx={{
							display: "inline-flex",
							alignItems: "center",
							gap: 0.5,
							mb: 0.5,
							fontSize: "0.875rem",
							fontWeight: 600,
							color: "text.secondary",
							textDecoration: "none",
							"&:hover": { color: "primary.main" },
						}}
					>
						<ArrowForwardRoundedIcon fontSize='small' />
						رجوع للمجلد
					</Box>
					<Typography
						variant='h1'
						sx={{ fontSize: { xs: "1.5rem", md: "2rem" }, lineHeight: 1.3 }}
					>
						{title}
					</Typography>
				</Box>
				<Typography
					sx={{ color: "text.secondary", fontWeight: 700, flexShrink: 0 }}
				>
					سؤال {current + 1} من {total}
				</Typography>
			</Stack>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 280px" },
					gap: { xs: 2, md: 3 },
					alignItems: "start",
				}}
			>
				{/* The question card fills the screen so the page rarely scrolls. */}
				<Surface
					variant='elevated'
					sx={{
						p: { xs: 2.5, md: 4 },
						display: "flex",
						flexDirection: "column",
						minHeight: { md: "min(600px, calc(100dvh - 230px))" },
					}}
				>
					{question ? (
						<>
							<Stack
								direction='row'
								justifyContent='space-between'
								alignItems='center'
								gap={1}
								sx={{ mb: 2 }}
							>
								<Typography
									sx={{
										fontWeight: 800,
										color: "primary.main",
										fontSize: "1.1rem",
									}}
								>
									سؤال {current + 1}
								</Typography>
								<Stack
									direction='row'
									gap={1}
									flexWrap='wrap'
									justifyContent='flex-end'
								>
									{question.source ? (
										<Chip
											size='small'
											color='secondary'
											variant='outlined'
											label={question.source}
										/>
									) : null}
									<Chip size='small' label={question.lesson} />
								</Stack>
							</Stack>
							<Typography
								component='h2'
								sx={{
									fontWeight: 600,
									lineHeight: 1.9,
									fontSize: { xs: "1.125rem", md: "1.3rem" },
									mb: 3,
									whiteSpace: "pre-wrap",
								}}
							>
								{question.text}
							</Typography>
							{question.image ? (
								<Box
									component='img'
									src={question.image}
									alt={`رسم السؤال ${current + 1}`}
									sx={{
										display: "block",
										maxWidth: "100%",
										maxHeight: 260,
										mx: "auto",
										mb: 3,
										borderRadius: 2,
										// Drawings are scanned on white; keep them readable in dark mode.
										bgcolor: "common.white",
									}}
								/>
							) : null}
							<Stack
								role='radiogroup'
								aria-label={`خيارات سؤال ${current + 1}`}
								spacing={1.25}
							>
								{question.options.map((option, index) => (
									<Option
										key={`${question.id}-${index}`}
										name={question.id}
										letter={LETTERS[index]}
										text={option}
										chosen={answers[question.id] === index}
										tone={optionTone(question, index)}
										locked={submitted}
										onChoose={() =>
											setAnswers((prev) => ({ ...prev, [question.id]: index }))
										}
									/>
								))}
							</Stack>
						</>
					) : (
						<Stack spacing={1.5} aria-busy>
							<Skeleton variant='text' width='30%' />
							<Skeleton variant='rounded' height={80} />
							{[0, 1, 2, 3].map((i) => (
								<Skeleton key={i} variant='rounded' height={56} />
							))}
						</Stack>
					)}

					<Stack
						direction='row'
						justifyContent='space-between'
						gap={2}
						sx={{ mt: "auto", pt: 3 }}
					>
						<Button
							variant='outlined'
							startIcon={<ArrowForwardRoundedIcon />}
							disabled={current === 0}
							onClick={() => setCurrent(current - 1)}
						>
							السابق
						</Button>
						<Button
							variant='contained'
							endIcon={<ArrowBackRoundedIcon />}
							disabled={current === total - 1}
							onClick={() => setCurrent(current + 1)}
						>
							التالي
						</Button>
					</Stack>
				</Surface>

				<Surface sx={{ p: 2, position: { md: "sticky" }, top: { md: 96 } }}>
					{result ? (
						<Box sx={{ textAlign: "center", mb: 2 }}>
							<Typography
								sx={{ fontSize: "2.25rem", fontWeight: 800, lineHeight: 1.2 }}
							>
								{result.correct} / {result.total}
							</Typography>
							<Typography variant='body2' sx={{ color: "text.secondary" }}>
								الأخضر صح، والأحمر غلط أو بلا إجابة
							</Typography>
						</Box>
					) : (
						<Box sx={{ mb: 2 }}>
							<Typography variant='body2' sx={{ mb: 0.75 }}>
								جاوبت {answered} من {total}
							</Typography>
							<LinearProgress
								variant='determinate'
								value={(answered / total) * 100}
								sx={{ height: 8, borderRadius: 4 }}
							/>
						</Box>
					)}
					<Box
						component='nav'
						aria-label='أرقام الأسئلة'
						sx={{
							display: "grid",
							gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
							gap: 1,
							maxHeight: { md: "calc(100dvh - 400px)" },
							overflowY: "auto",
							p: 0.5,
						}}
					>
						{Array.from({ length: total }, (_, i) => {
							const tone = mapTone(i);
							return (
								<Box
									key={i}
									component='button'
									type='button'
									onClick={() => setCurrent(i)}
									aria-label={`سؤال ${i + 1}`}
									aria-current={i === current ? "step" : undefined}
									sx={(theme) => ({
										height: 40,
										borderRadius: `${theme.tokens.radii.sm}px`,
										border: `2px solid ${
											i === current
												? theme.palette.text.primary
												: tone
													? theme.palette[tone].main
													: theme.tokens.colors.border
										}`,
										bgcolor: tone ? theme.palette[tone].main : "transparent",
										color: tone ? "common.white" : "text.primary",
										fontWeight: 700,
										fontFamily: "inherit",
										fontSize: "0.95rem",
										cursor: "pointer",
									})}
								>
									{i + 1}
								</Box>
							);
						})}
					</Box>
					<Box sx={{ mt: 2 }}>
						{result ? (
							<Button fullWidth variant='contained' onClick={retry}>
								أعد الامتحان
							</Button>
						) : (
							<LoadingButton
								fullWidth
								variant='contained'
								disabled={!answered}
								loading={submitting && !confirming}
								onClick={() =>
									unanswered ? setConfirming(true) : void submit()
								}
							>
								سلّم الامتحان
							</LoadingButton>
						)}
					</Box>
				</Surface>
			</Box>

			<ConfirmDialog
				open={confirming}
				title='تسليم الامتحان'
				description={`لم تجب على ${unanswered} من ${total} سؤال، وستُحسب خاطئة. هل تريد التسليم الآن؟`}
				confirmLabel='سلّم الآن'
				cancelLabel='أكمل الإجابة'
				destructive={false}
				loading={submitting}
				onConfirm={submit}
				onClose={() => setConfirming(false)}
			/>
			{result ? (
				<ResultDialog
					open={showResult}
					result={result}
					backHref={backHref}
					onClose={() => setShowResult(false)}
				/>
			) : null}
		</PageContainer>
	);
}
