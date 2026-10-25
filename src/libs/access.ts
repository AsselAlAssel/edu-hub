import { getSessionUser } from "./api";
import { getBreadcrumbs } from "./folder";
import { prisma } from "./prismaDb";

/** The signed-in user as stored now: role and units come from the DB, not the JWT. */
export type Viewer = {
	id: string;
	role: string | null;
	unlockedUnitIds: string[];
} | null;

/** A first-level folder of a class; `price` set means it is sold. */
export type Unit = { id: string; name: string; price: number | null };

export async function getViewer(): Promise<Viewer> {
	const session = await getSessionUser();
	if (!session?.id) return null;
	const user = await prisma.user.findUnique({
		where: { id: session.id },
		select: { id: true, role: true, unlockedUnitIds: true },
	});
	return user && { ...user, unlockedUnitIds: user.unlockedUnitIds ?? [] };
}

/** The unit a folder belongs to (its first-level ancestor), or null for the class root. */
export async function getUnit(folderId: string): Promise<Unit | null> {
	const crumbs = await getBreadcrumbs(folderId);
	const unit = crumbs?.[1];
	if (!unit) return null;
	const folder = await prisma.folder.findUnique({
		where: { id: unit.id },
		select: { price: true },
	});
	return { id: unit.id, name: unit.name, price: folder?.price ?? null };
}

/** Paid content opens for admins and for students the admin unlocked the unit for. */
export function canOpenUnit(viewer: Viewer, unit: Unit | null) {
	if (!unit?.price) return true;
	if (!viewer) return false;
	return viewer.role === "ADMIN" || viewer.unlockedUnitIds.includes(unit.id);
}
