import { createHash } from "node:crypto";

/**
 * How long a signed embed URL can be opened. It only gates loading the player:
 * once loaded, Bunny issues its own CDN token (about 10 hours, measured 2026-10-25).
 */
export const BUNNY_TOKEN_TTL_SECONDS = 120;

/**
 * Bunny Stream "Embed view token authentication":
 * token = SHA256_HEX(token_security_key + video_id + expires), expires in UNIX seconds.
 * https://docs.bunny.net/docs/stream-embed-token-authentication
 */
export function signBunnyEmbedUrl({
	libraryId,
	videoId,
	tokenKey,
	expires,
}: {
	libraryId: string;
	videoId: string;
	tokenKey: string;
	expires: number;
}) {
	const token = createHash("sha256")
		.update(tokenKey + videoId + expires)
		.digest("hex");
	const url = new URL(
		`https://player.mediadelivery.net/embed/${encodeURIComponent(libraryId)}/${encodeURIComponent(videoId)}`
	);
	url.searchParams.set("token", token);
	url.searchParams.set("expires", String(expires));
	return url.toString();
}
