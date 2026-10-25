import { canOpenUnit, getUnit, type Unit, type Viewer } from "./access";
import type { Video } from "@prisma/client";
import { isBunnyUrl } from "./bunnyUrl";
import { PAID_FILE_URL, SIGNIN_FILE_URL } from "./constant";
import { prisma } from "./prismaDb";

const classInclude = {
	folders: { where: { isRoot: true } },
	// `folders` counts paid units (only first-level folders can be priced).
	_count: {
		select: {
			files: true,
			videos: true,
			folders: { where: { price: { not: null } } },
		},
	},
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
 * A folder's contents as `viewer` may see them, and nothing more:
 * - files: guests get neither name nor link (SIGNIN_FILE_URL); students
 *   without the paid unit get neither either (PAID_FILE_URL).
 * - Bunny videos never carry their link or Bunny id: the player asks
 *   /api/video/[id]/playback (which re-checks access) and the card shows
 *   /api/video/[id]/thumbnail. `locked` tells the card to show the paywall.
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
	const landing = unit?.price
		? await prisma.landingPage.findFirst({ select: { whatsAppNumber: true } })
		: null;
	const whatsAppNumber = landing?.whatsAppNumber ?? null;

	const lock = (file: (typeof files)[number]) => {
		if (!viewer) return { ...file, name: "", url: SIGNIN_FILE_URL };
		return canOpen ? file : { ...file, name: "", url: PAID_FILE_URL };
	};
	const strip = (video: (typeof videos)[number]): ResourceVideo => {
		if (!isBunnyUrl(video.url)) return video;
		return { ...video, url: "", videoId: "", isBunny: true, locked: !canOpen };
	};

	const access: ResourceAccess = {
		unit,
		canOpen,
		ownedUnitIds: viewer?.unlockedUnitIds ?? [],
		whatsAppNumber,
	};
	return {
		folders,
		files: files.map(lock),
		videos: videos.map(strip),
		access,
	};
};

/** Bunny videos arrive without url/videoId, flagged instead. */
export type ResourceVideo = Video & { isBunny?: boolean; locked?: boolean };

export type ResourceAccess = {
	unit: Unit | null;
	canOpen: boolean;
	/** The viewer's own units, to badge priced folders on the class page. */
	ownedUnitIds: string[];
	whatsAppNumber: string | null;
};

export type Resources = Awaited<ReturnType<typeof getResources>>;
