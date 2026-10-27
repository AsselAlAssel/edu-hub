"use client";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import StatTile from "@/components/ui/StatTile";
import { ErrorState, LoadingState } from "@/components/ui/States";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import { Box, Button, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import useSWR from "swr";
import {
	EXAMS_KEY,
	type ExamsResponse,
	fetcher,
	LESSONS_KEY,
	type LessonSummary,
} from "./api";
import ExamsPanel from "./ExamsPanel";
import QuestionBank from "./QuestionBank";

const sum = (lessons: LessonSummary[], pick: (l: LessonSummary) => number) =>
	lessons.reduce((total, l) => total + pick(l), 0);

/** Admin: the question bank (by lesson) and the exams attached to folders. */
export default function ExamsAdmin() {
	const [tab, setTab] = useState<"bank" | "exams">("bank");
	const lessons = useSWR(LESSONS_KEY, fetcher<LessonSummary[]>);
	const exams = useSWR(EXAMS_KEY, fetcher<ExamsResponse>);
	const error = lessons.error ?? exams.error;

	return (
		<PageShell>
			<PageHeader
				eyebrow='الإدارة'
				title='الامتحانات'
				description='بنك الأسئلة مقسّم حسب الدروس، والامتحانات مربوطة بالمجلدات المدفوعة.'
			/>
			{error ? (
				<ErrorState
					action={
						<Button
							variant='outlined'
							onClick={() =>
								void Promise.all([lessons.mutate(), exams.mutate()])
							}
						>
							إعادة المحاولة
						</Button>
					}
				/>
			) : !lessons.data || !exams.data ? (
				<LoadingState />
			) : (
				<>
					<Box
						sx={{
							display: "grid",
							gap: 1.5,
							mb: 3,
							gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" },
						}}
					>
						<StatTile
							icon={<LibraryBooksOutlinedIcon />}
							label='سؤال في البنك'
							value={sum(lessons.data, (l) => l.count)}
							tone='primary'
						/>
						<StatTile
							icon={<MenuBookOutlinedIcon />}
							label='درس'
							value={lessons.data.length}
							tone='info'
						/>
						<StatTile
							icon={<ImageOutlinedIcon />}
							label='سؤال مع رسم'
							value={sum(lessons.data, (l) => l.withImages)}
							tone='warning'
						/>
						<StatTile
							icon={<QuizOutlinedIcon />}
							label='امتحان'
							value={exams.data.exams.length}
							tone='success'
						/>
					</Box>
					<Tabs
						value={tab}
						onChange={(_, value) => setTab(value)}
						aria-label='أقسام الامتحانات'
						sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
					>
						<Tab
							value='bank'
							label='بنك الأسئلة'
							icon={<LibraryBooksOutlinedIcon />}
							iconPosition='start'
							id='exams-tab-bank'
							aria-controls='exams-panel-bank'
						/>
						<Tab
							value='exams'
							label='الامتحانات'
							icon={<QuizOutlinedIcon />}
							iconPosition='start'
							id='exams-tab-exams'
							aria-controls='exams-panel-exams'
						/>
					</Tabs>
					<Box
						role='tabpanel'
						id={`exams-panel-${tab}`}
						aria-labelledby={`exams-tab-${tab}`}
					>
						{tab === "bank" ? (
							<QuestionBank lessons={lessons.data} />
						) : (
							<ExamsPanel data={exams.data} lessons={lessons.data} />
						)}
					</Box>
				</>
			)}
		</PageShell>
	);
}
