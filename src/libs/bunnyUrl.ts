// Client-safe: no secrets or node:crypto here.
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
