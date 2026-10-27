import type { Exam, Question } from "@prisma/client";
import axios from "axios";

export type { Exam, Question };
export type LessonSummary = {
	lesson: string;
	count: number;
	withImages: number;
};
export type FolderOption = { id: string; label: string };
export type ExamsResponse = { exams: Exam[]; folders: FolderOption[] };

export const LESSONS_KEY = "/api/exams/lessons";
export const EXAMS_KEY = "/api/exams";
export const lessonKey = (lesson: string) =>
	`/api/exams/questions?lesson=${encodeURIComponent(lesson)}`;
export const searchKey = (q: string) =>
	`/api/exams/questions?q=${encodeURIComponent(q)}`;
export const idsKey = (ids: string[]) =>
	`/api/exams/questions?ids=${ids.join(",")}`;

export const fetcher = <T>(url: string) =>
	axios.get<T>(url).then((res) => res.data);

/** Every cached exams/questions key: refreshed together after any write. */
export const isExamsKey = (key: unknown) =>
	typeof key === "string" && key.startsWith("/api/exams");

/** Arabic option letters, as printed in the ministry exams. */
export const LETTERS = ["أ", "ب", "ج", "د", "هـ", "و"];

export { UNLOCK_RULES, type UnlockRule } from "@/constants/exams";
