import { isUnlockRule } from "@/constants/exams";
import { cleanString, isObjectId } from "./api";

/** Validated question fields from a request body, or an Arabic error. */
export function parseQuestion(body: Record<string, any>) {
	const lesson = cleanString(body.lesson);
	const text = cleanString(body.text, 3000);
	const options: unknown[] = Array.isArray(body.options) ? body.options : [];
	const cleaned = options.map((o) => cleanString(o, 500));
	const { correctIndex } = body;

	if (!lesson) return { error: "اختر الدرس" };
	if (!text) return { error: "اكتب نص السؤال" };
	if (cleaned.length < 2 || cleaned.length > 6 || cleaned.some((o) => !o))
		return { error: "يلزم من 2 إلى 6 خيارات غير فارغة" };
	if (
		!Number.isInteger(correctIndex) ||
		correctIndex < 0 ||
		correctIndex >= cleaned.length
	)
		return { error: "حدد الإجابة الصحيحة" };

	return {
		data: {
			lesson,
			text,
			options: cleaned as string[],
			correctIndex: correctIndex as number,
			image: cleanString(body.image, 1000),
			source: cleanString(body.source),
		},
	};
}

/** Validated exam fields from a request body, or an Arabic error. */
export function parseExam(body: Record<string, any>) {
	const title = cleanString(body.title);
	const ids: unknown[] = Array.isArray(body.questionIds)
		? body.questionIds
		: [];

	if (!title) return { error: "اكتب عنوان الامتحان" };
	if (!isObjectId(body.folderId)) return { error: "اختر المجلد" };
	if (!ids.length || !ids.every(isObjectId))
		return { error: "اختر سؤالاً واحداً على الأقل" };
	if (!isUnlockRule(body.unlockRule))
		return { error: "اختر متى يظهر الامتحان" };

	return {
		data: {
			title,
			folderId: body.folderId as string,
			questionIds: Array.from(new Set(ids as string[])),
			unlockRule: body.unlockRule,
		},
	};
}

/** Score against the answer key; anything not a chosen index counts as unanswered. */
export function gradeExam(
	keys: { id: string; correctIndex: number }[],
	answers: Record<string, unknown>
) {
	const key: Record<string, number> = {};
	let correct = 0;
	for (const q of keys) {
		key[q.id] = q.correctIndex;
		if (answers[q.id] === q.correctIndex) correct++;
	}
	return { correct, total: keys.length, key };
}

export type AttemptScore = { correct: number; total: number };

/** Count, latest and best score from attempts ordered newest first; null if none. */
export function summarizeAttempts(attempts: AttemptScore[]) {
	if (!attempts.length) return null;
	const ratio = (a: AttemptScore) => (a.total ? a.correct / a.total : 0);
	const best = attempts.reduce((top, a) => (ratio(a) > ratio(top) ? a : top));
	const pick = ({ correct, total }: AttemptScore) => ({ correct, total });
	return { count: attempts.length, last: pick(attempts[0]), best: pick(best) };
}
