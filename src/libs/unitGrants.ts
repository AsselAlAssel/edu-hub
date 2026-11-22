import { yearIn } from "./zonedTime";

/**
 * When paid-unit access ends: 31 August of the year after the unit was opened,
 * 23:59 in Palestine. One Tawjihi school year. Lives here (no server imports)
 * so the admin dialog can show the default date.
 */
export const UNIT_ACCESS_CUTOFF = {
	month: 8,
	day: 31,
	hour: 23,
	minute: 59,
	timeZone: "Asia/Jerusalem",
} as const;

/** The default end day ("YYYY-MM-DD") of a unit opened at `openedAt`. */
export const defaultEndDay = (openedAt: Date = new Date()) => {
	const { month, day, timeZone } = UNIT_ACCESS_CUTOFF;
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${yearIn(openedAt, timeZone) + 1}-${pad(month)}-${pad(day)}`;
};

/** Dates come back from the API as ISO strings, from Prisma as Dates. */
export type UnitGrant = { unitId: string; expiresAt: Date | string };

const endsAt = (grant: UnitGrant) => new Date(grant.expiresAt).getTime();

export const isGrantActive = (grant: UnitGrant, now = Date.now()) =>
	endsAt(grant) > now;

export const activeUnitIds = (grants: UnitGrant[], now = Date.now()) =>
	grants
		.filter((grant) => isGrantActive(grant, now))
		.map(({ unitId }) => unitId);

export const findGrant = (grants: UnitGrant[], unitId: string) =>
	grants.find((grant) => grant.unitId === unitId) ?? null;

/**
 * The grants after the admin saves `unitIds`. `overrides` (end dates the admin
 * picked) win; otherwise a unit still open keeps its end date and a new or
 * expired one gets `freshEnd`. A dropped open unit is revoked; expired grants
 * of other units stay as history.
 */
export function nextUnitGrants(
	current: UnitGrant[],
	unitIds: string[],
	{
		freshEnd,
		overrides = {},
		now = Date.now(),
	}: { freshEnd: Date; overrides?: Record<string, Date>; now?: number }
): { unitId: string; expiresAt: Date }[] {
	const wanted = new Set(unitIds);
	const open = new Map(
		current
			.filter((grant) => isGrantActive(grant, now))
			.map((grant) => [grant.unitId, new Date(grant.expiresAt)])
	);
	const granted = Array.from(wanted, (unitId) => ({
		unitId,
		expiresAt: overrides[unitId] ?? open.get(unitId) ?? freshEnd,
	}));
	const history = current
		.filter((grant) => !wanted.has(grant.unitId) && !isGrantActive(grant, now))
		.map((grant) => ({
			unitId: grant.unitId,
			expiresAt: new Date(grant.expiresAt),
		}));
	return [...granted, ...history];
}
