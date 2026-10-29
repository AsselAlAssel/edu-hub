import { rangeToLoad } from "@/scenes/ExamPage/questionWindow";
import { describe, expect, it } from "vitest";

const loaded = (...ranges: [number, number][]) => {
	const set = new Set<number>();
	for (const [from, to] of ranges) for (let i = from; i < to; i++) set.add(i);
	return (i: number) => set.has(i);
};

describe("rangeToLoad", () => {
	it("loads the first 10 on open", () => {
		expect(rangeToLoad(0, 73, loaded())).toEqual([0, 10]);
	});
	it("loads 5 before and after a jump", () => {
		expect(rangeToLoad(40, 73, loaded([0, 10]))).toEqual([35, 46]);
	});
	it("prefetches the next 10 when 3 from the loaded edge", () => {
		expect(rangeToLoad(6, 73, loaded([0, 10]))).toBeNull();
		expect(rangeToLoad(7, 73, loaded([0, 10]))).toEqual([10, 20]);
	});
	it("never asks past the end or for what is loaded", () => {
		expect(rangeToLoad(70, 73, loaded([0, 10]))).toEqual([65, 73]);
		expect(rangeToLoad(9, 12, loaded([0, 10]))).toEqual([10, 12]);
		expect(rangeToLoad(4, 5, loaded([0, 5]))).toBeNull();
	});
});
