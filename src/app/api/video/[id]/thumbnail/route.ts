import { isObjectId } from "@/libs/api";
import { signBunnyEmbedUrl } from "@/libs/bunny";
import { parseBunnyUrl } from "@/libs/bunnyUrl";
import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

const PLACEHOLDER = "/images/video-placeholder.svg";
const PLAYER_ORIGIN = "https://player.mediadelivery.net/";

/**
 * Bunny thumbnails sit behind CDN token auth, signed with a key we do not
 * hold. The player page signs them for us: sign an embed URL, read the
 * thumbnail link from the page, fetch it server-side and stream the image.
 * The thumbnail is a public teaser (no access check); the CDN caches it.
 * ponytail: scrapes the player HTML; if Bunny changes it we fall back to the
 * placeholder. Upgrade path: Bunny Stream API key + its thumbnail endpoint.
 */
export const GET = async (
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) => {
	const fallback = () =>
		NextResponse.redirect(new URL(PLACEHOLDER, req.url), {
			headers: { "Cache-Control": "public, max-age=300" },
		});

	const { id } = await props.params;
	if (!isObjectId(id)) return fallback();
	const video = await prisma.video.findUnique({
		where: { id },
		select: { url: true },
	});
	const bunny = video && parseBunnyUrl(video.url);
	const libraryId = process.env.BUNNY_LIBRARY_ID?.trim();
	const tokenKey = process.env.BUNNY_TOKEN_KEY?.trim();
	if (!bunny || !libraryId || !tokenKey) return fallback();

	try {
		const embed = signBunnyEmbedUrl({
			libraryId,
			videoId: bunny.videoId,
			tokenKey,
			expires: Math.floor(Date.now() / 1000) + 60,
		});
		const html = await (await fetch(embed, { cache: "no-store" })).text();
		const thumbnail = html
			.match(/https:\/\/vz-[^"'\s<>]*token_path[^"'\s<>]*thumbnail\.jpg/)?.[0]
			?.replace(/&amp;/g, "&");
		if (!thumbnail) return fallback();

		const image = await fetch(thumbnail, {
			headers: { Referer: PLAYER_ORIGIN },
			cache: "no-store",
		});
		if (!image.ok) return fallback();
		return new NextResponse(image.body, {
			headers: {
				"Content-Type": image.headers.get("content-type") ?? "image/jpeg",
				"Cache-Control": "public, max-age=86400, s-maxage=604800",
			},
		});
	} catch {
		return fallback();
	}
};
