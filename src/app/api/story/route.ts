import {
	cleanString,
	isObjectId,
	jsonError,
	readJson,
	requireAdmin,
} from "@/libs/api";
import { getYouTubeVideoID } from "@/libs/constant";
import { getRankAfterLast } from "@/libs/lexorank";
import { prisma } from "@/libs/prismaDb";
import { getStories } from "@/libs/story";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_IMAGES = 10;

/** Title, description, images and YouTube link from a request body. */
function readStory(body: Record<string, unknown>) {
	const title = cleanString(body.title, 150);
	const description =
		typeof body.description === "string"
			? body.description.trim().slice(0, 3000)
			: "";
	const rawImages: unknown[] = Array.isArray(body.images) ? body.images : [];
	const images = rawImages
		.filter((url): url is string => typeof url === "string" && !!url)
		.map((url) => url.slice(0, 2000))
		.slice(0, MAX_IMAGES);
	const youtubeUrl = cleanString(body.youtubeUrl, 500);
	if (!title) return { error: "Missing title" };
	if (youtubeUrl && !getYouTubeVideoID(youtubeUrl))
		return { error: "Invalid YouTube URL" };
	// One kind of media per story.
	if (!youtubeUrl && !images.length) return { error: "Missing media" };
	return {
		data: {
			title,
			description,
			images: youtubeUrl ? [] : images,
			youtubeUrl: youtubeUrl || null,
		},
	};
}

export const GET = async () => NextResponse.json(await getStories());

export const POST = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const story = readStory(await readJson(req));
	if (!story.data) return jsonError(story.error, 400);

	const last = await prisma.story.findFirst({
		orderBy: [{ rank: "desc" }, { createdAt: "desc" }],
		select: { rank: true },
	});
	const created = await prisma.story.create({
		data: { ...story.data, rank: getRankAfterLast(last?.rank) },
	});

	revalidatePath("/results");
	return NextResponse.json(created, { status: 201 });
};

export const PUT = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const body = await readJson(req);
	if (!isObjectId(body.id)) return jsonError("Missing Fields", 400);
	const story = readStory(body);
	if (!story.data) return jsonError(story.error, 400);

	const existing = await prisma.story.findUnique({ where: { id: body.id } });
	if (!existing) return jsonError("Story not found", 404);

	const updated = await prisma.story.update({
		where: { id: body.id },
		data: story.data,
	});

	revalidatePath("/results");
	return NextResponse.json(updated, { status: 200 });
};

export const DELETE = async (req: Request) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await readJson(req);
	if (!isObjectId(id)) return jsonError("Missing Fields", 400);

	const existing = await prisma.story.findUnique({ where: { id } });
	if (!existing) return jsonError("Story not found", 404);
	await prisma.story.delete({ where: { id } });

	revalidatePath("/results");
	return NextResponse.json({ success: true }, { status: 200 });
};
