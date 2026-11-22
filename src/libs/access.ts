import { getSessionUser } from "./api";
import { getBreadcrumbs } from "./folder";
import { prisma } from "./prismaDb";
import { activeUnitIds, type UnitGrant } from "./unitGrants";
import { yearIn, zonedDate } from "./zonedTime";

/**
 * When paid-unit access ends: 31 August of the year after the unit was opened,
 * 23:59 in Palestine. One Tawjihi school year.
 */
export const UNIT_ACCESS_CUTOFF = {
	month: 8,
	day: 31,
	hour: 23,
	minute: 59,
	timeZone: "Asia/Jerusalem",
} as const;

const {
	timeZone: ACCESS_TZ,
	hour: END_HOUR,
	minute: END_MINUTE,
} = UNIT_ACCESS_CUTOFF;

/** The cutoff in a given year. */
export const unitAccessEndInYear = (year: number) =>
	zonedDate(
		{
			year,
			month: UNIT_ACCESS_CUTOFF.month,
			day: UNIT_ACCESS_CUTOFF.day,
			hour: END_HOUR,
			minute: END_MINUTE,
		},
		ACCESS_TZ
	);

/** When a unit opened at `openedAt` closes. */
export const unitAccessEnd = (openedAt: Date = new Date()) =>
	unitAccessEndInYear(yearIn(openedAt, ACCESS_TZ) + 1);

/** An admin-picked end day ("YYYY-MM-DD"): 23:59 that day in Palestine; null if invalid. */
export function unitAccessEndOn(day: unknown): Date | null {
	if (typeof day !== "string") return null;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
	if (!match) return null;
	const [year, month, date] = match.slice(1).map(Number);
	const check = new Date(Date.UTC(year, month - 1, date));
	if (check.getUTCMonth() !== month - 1 || check.getUTCDate() !== date) {
		return null;
	}
	return zonedDate(
		{ year, month, day: date, hour: END_HOUR, minute: END_MINUTE },
		ACCESS_TZ
	);
}

/** The signed-in user as stored now: role and units come from the DB, not the JWT. */
export type Viewer = {
	id: string;
	email: string | null;
	role: string | null;
	/** Units open right now (grants not expired yet). */
	unlockedUnitIds: string[];
	/** Every grant, expired ones included. */
	unitGrants: UnitGrant[];
} | null;

/** A first-level folder of a class; `price` set means it is sold. */
export type Unit = { id: string; name: string; price: number | null };

export async function getViewer(): Promise<Viewer> {
	const session = await getSessionUser();
	if (!session?.id) return null;
	const user = await prisma.user.findUnique({
		where: { id: session.id },
		select: { id: true, email: true, role: true, unitGrants: true },
	});
	if (!user) return null;
	const unitGrants = user.unitGrants ?? [];
	return { ...user, unitGrants, unlockedUnitIds: activeUnitIds(unitGrants) };
}

/** The unit a folder belongs to (its first-level ancestor), or null for the class root. */
export async function getUnit(folderId: string): Promise<Unit | null> {
	const crumbs = await getBreadcrumbs(folderId);
	const unit = crumbs?.[1];
	if (!unit) return null;
	return { id: unit.id, name: unit.name, price: unit.price ?? null };
}

/** A folder can be sold as a unit only if its parent is the class root. */
export async function isFirstLevelFolder(folder: {
	isRoot: boolean;
	parentFolderId: string | null;
}) {
	if (folder.isRoot || !folder.parentFolderId) return false;
	const parent = await prisma.folder.findUnique({
		where: { id: folder.parentFolderId },
		select: { isRoot: true },
	});
	return !!parent?.isRoot;
}

/** Every unit on sale, grouped by class, in class then folder order. */
export async function listPaidUnits() {
	const priced = await prisma.folder.findMany({
		where: { price: { not: null }, parentFolder: { is: { isRoot: true } } },
		select: {
			id: true,
			name: true,
			price: true,
			classId: true,
			parentClass: { select: { name: true } },
		},
		orderBy: [{ classId: "asc" }, { rank: "asc" }],
	});
	const byClass = new Map<
		string,
		{ classId: string; className: string; units: Unit[] }
	>();
	for (const folder of priced) {
		const group = byClass.get(folder.classId) ?? {
			classId: folder.classId,
			className: folder.parentClass.name,
			units: [],
		};
		group.units.push({ id: folder.id, name: folder.name, price: folder.price });
		byClass.set(folder.classId, group);
	}
	return Array.from(byClass.values());
}

export type PaidUnitGroup = Awaited<ReturnType<typeof listPaidUnits>>[number];

/** Paid content opens for admins and for students whose grant on the unit is still open. */
export function canOpenUnit(viewer: Viewer, unit: Unit | null) {
	if (!unit?.price) return true;
	if (!viewer) return false;
	return viewer.role === "ADMIN" || viewer.unlockedUnitIds.includes(unit.id);
}
