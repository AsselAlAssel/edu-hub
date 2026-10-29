import {
	gradeExam,
	parseExam,
	parseQuestion,
	summarizeAttempts,
} from "@/libs/exams";
import { describe, expect, it } from "vitest";

const id = "a".repeat(24);
const question = {
	lesson: "التصادمات",
	text: "سؤال",
	options: ["1", "2"],
	correctIndex: 1,
};
const exam = {
	title: "امتحان",
	folderId: id,
	questionIds: [id, id],
	unlockRule: "TREE",
};

describe("parseQuestion", () => {
	it("accepts a valid question", () => {
		expect(parseQuestion(question).data).toMatchObject({
			correctIndex: 1,
			image: null,
		});
	});
	it("rejects a correct index outside the options", () => {
		expect(parseQuestion({ ...question, correctIndex: 2 }).error).toBeTruthy();
	});
	it("rejects empty options", () => {
		expect(
			parseQuestion({ ...question, options: ["1", " "] }).error
		).toBeTruthy();
	});
});

describe("parseExam", () => {
	it("dedupes question ids", () => {
		expect(parseExam(exam).data?.questionIds).toEqual([id]);
	});
	it("rejects an unknown unlock rule and a bad folder", () => {
		expect(parseExam({ ...exam, unlockRule: "X" }).error).toBeTruthy();
		expect(parseExam({ ...exam, folderId: "1" }).error).toBeTruthy();
	});
});

describe("gradeExam", () => {
	const keys = [
		{ id: "a", correctIndex: 0 },
		{ id: "b", correctIndex: 2 },
		{ id: "c", correctIndex: 1 },
	];
	it("counts only exact matches and returns the key", () => {
		expect(gradeExam(keys, { a: 0, b: 1, c: "1", x: 0 })).toEqual({
			correct: 1,
			total: 3,
			key: { a: 0, b: 2, c: 1 },
		});
	});
});

describe("summarizeAttempts", () => {
	it("is null with no attempts", () => {
		expect(summarizeAttempts([])).toBeNull();
	});
	it("takes the newest as last and the best by ratio", () => {
		expect(
			summarizeAttempts([
				{ correct: 5, total: 10 },
				{ correct: 18, total: 25 },
				{ correct: 9, total: 10 },
			])
		).toEqual({
			count: 3,
			last: { correct: 5, total: 10 },
			best: { correct: 9, total: 10 },
		});
	});
});
