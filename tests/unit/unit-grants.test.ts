// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
	activeUnitIds,
	defaultEndDay,
	nextUnitGrants,
} from "@/libs/unitGrants";

const NOW = Date.UTC(2026, 10, 22);
const DAY = 86_400_000;
const CUTOFF = new Date("2027-08-31T20:59:00.000Z");
const at = (days: number) => new Date(NOW + days * DAY);
const next = (
	current: { unitId: string; expiresAt: Date }[],
	unitIds: string[],
	overrides?: Record<string, Date>
) =>
	nextUnitGrants(current, unitIds, { freshEnd: CUTOFF, overrides, now: NOW });

describe("activeUnitIds", () => {
	it("keeps only grants that have not ended yet", () => {
		const grants = [
			{ unitId: "open", expiresAt: at(1) },
			{ unitId: "ended", expiresAt: at(-1) },
			{ unitId: "iso", expiresAt: at(2).toISOString() },
		];
		expect(activeUnitIds(grants, NOW)).toEqual(["open", "iso"]);
	});
});

describe("nextUnitGrants", () => {
	it("opens new units until the cutoff", () => {
		expect(next([], ["u1"])).toEqual([{ unitId: "u1", expiresAt: CUTOFF }]);
	});

	it("keeps the end date of a unit still open", () => {
		expect(next([{ unitId: "u1", expiresAt: at(30) }], ["u1"])).toEqual([
			{ unitId: "u1", expiresAt: at(30) },
		]);
	});

	it("renews an expired unit until the cutoff", () => {
		expect(next([{ unitId: "u1", expiresAt: at(-5) }], ["u1"])).toEqual([
			{ unitId: "u1", expiresAt: CUTOFF },
		]);
	});

	it("lets an admin-picked date win", () => {
		expect(
			next([{ unitId: "u1", expiresAt: at(30) }], ["u1"], { u1: at(90) })
		).toEqual([{ unitId: "u1", expiresAt: at(90) }]);
	});

	it("revokes a dropped open unit but keeps expired ones as history", () => {
		const current = [
			{ unitId: "open", expiresAt: at(10) },
			{ unitId: "ended", expiresAt: at(-10) },
		];
		expect(next(current, [])).toEqual([
			{ unitId: "ended", expiresAt: at(-10) },
		]);
	});
});

describe("defaultEndDay", () => {
	it("is 31 August of the next year", () => {
		expect(defaultEndDay(new Date(NOW))).toBe("2027-08-31");
	});

	it("uses the year in Jerusalem, not UTC", () => {
		// 31 Dec 2026 22:30 UTC is already 1 Jan 2027 in Jerusalem.
		expect(defaultEndDay(new Date("2026-12-31T22:30:00Z"))).toBe("2028-08-31");
	});
});
