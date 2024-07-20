export function absoluteUrl(path: string) {
	return `${process.env.SITE_URL || "http://localhost:3000"}${path}`;
}
