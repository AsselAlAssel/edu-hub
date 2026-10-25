import { createHash } from "node:crypto";

/** Short on purpose: long enough to start playback, short enough to test expiry. */
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

const BUNNY_HOSTS = ["iframe.mediadelivery.net", "player.mediadelivery.net"];
const BUNNY_PATH =
	/^\/(?:embed|play)\/(\d+)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;

/** Library and video ids from a Bunny Stream embed/play link, else null. */
export function parseBunnyUrl(value: string) {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== "https:" || !BUNNY_HOSTS.includes(url.hostname)) {
		return null;
	}
	const match = url.pathname.match(BUNNY_PATH);
	return match
		? { libraryId: match[1], videoId: match[2].toLowerCase() }
		: null;
}

export const isBunnyUrl = (url: string) => !!parseBunnyUrl(url);

/** Only the account in BUNNY_TEST_EMAIL may use /bunny-test; unset = nobody. */
export function canUseBunnyTest(user: { email?: string | null } | null) {
	const allowed = process.env.BUNNY_TEST_EMAIL?.trim().toLowerCase();
	return !!allowed && user?.email?.trim().toLowerCase() === allowed;
}

/** Server-only config for the /bunny-test page; null when anything is missing. */
export function bunnyTestConfig() {
	const libraryId = process.env.BUNNY_LIBRARY_ID?.trim();
	const tokenKey = process.env.BUNNY_TOKEN_KEY?.trim();
	const videoId = process.env.BUNNY_TEST_VIDEO_ID?.trim();
	return libraryId && tokenKey && videoId
		? { libraryId, tokenKey, videoId }
		: null;
}
