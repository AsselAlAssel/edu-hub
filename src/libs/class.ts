import { canOpenUnit, getUnit, type Unit, type Viewer } from "./access";
import { PAID_FILE_URL, SIGNIN_FILE_URL } from "./constant";
import { prisma } from "./prismaDb";

const classInclude = {
	folders: { where: { isRoot: true } },
	_count: { select: { files: true, videos: true } },
} as const;

/** Public list; admins pass `includeHidden` to also get hidden classes. */
export const getClasses = (includeHidden = false) =>
	prisma.class.findMany({
		where: includeHidden ? undefined : { hidden: false },
		include: classInclude,
		orderBy: { createdAt: "asc" },
	});

export type ClassWithMeta = Awaited<ReturnType<typeof getClasses>>[number];

export const getClass = (classId: string) =>
	prisma.class.findUnique({
		where: { id: classId },
		include: classInclude,
	});

/**
 * A folder's contents as `viewer` may see them. Guests (no viewer) get files
 * without name or link (SIGNIN_FILE_URL); inside a paid unit the student has
 * not bought, files keep their name but lose their link (PAID_FILE_URL).
 * `access` drives the paywall; videos are locked on the client from it and
 * playback is checked again by /api/video/[id]/playback.
 */
export const getResources = async (folderId: string, viewer?: Viewer) => {
	const orderBy = [{ rank: "asc" as const }, { createdAt: "asc" as const }];
	const [folders, videos, files, unit] = await Promise.all([
		prisma.folder.findMany({ where: { parentFolderId: folderId }, orderBy }),
		prisma.video.findMany({ where: { folderId }, orderBy }),
		prisma.file.findMany({ where: { folderId }, orderBy }),
		getUnit(folderId),
	]);
	const canOpen = canOpenUnit(viewer ?? null, unit);
	const whatsAppNumber = unit?.price
		? ((
				await prisma.landingPage.findFirst({ select: { whatsAppNumber: true } })
			)?.whatsAppNumber ?? null)
		: null;

	const lock = (file: (typeof files)[number]) => {
		if (!viewer) return { ...file, name: "", url: SIGNIN_FILE_URL };
		return canOpen ? file : { ...file, url: PAID_FILE_URL };
	};

	const access: ResourceAccess = {
		unit,
		canOpen,
		ownedUnitIds: viewer?.unlockedUnitIds ?? [],
		whatsAppNumber,
	};
	return { folders, files: files.map(lock), videos, access };
};

export type ResourceAccess = {
	unit: Unit | null;
	canOpen: boolean;
	/** The viewer's own units, to badge priced folders on the class page. */
	ownedUnitIds: string[];
	whatsAppNumber: string | null;
};

export type Resources = Awaited<ReturnType<typeof getResources>>;
