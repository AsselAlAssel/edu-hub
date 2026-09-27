/** Hosts allowed in next.config.js `images.remotePatterns` (inlined at build). */
const OPTIMIZED_HOSTS = (process.env.NEXT_PUBLIC_IMAGE_HOSTS ?? "")
	.split(",")
	.filter(Boolean);

/**
 * Whether next/image may send `src` through the optimizer. CMS images from any
 * other host (legacy or pasted URLs) must render with `unoptimized`, otherwise
 * the optimizer rejects them and the image breaks.
 */
export const canOptimizeImage = (src: string) => {
	if (src.startsWith("/")) return true;
	try {
		const url = new URL(src);
		return url.protocol === "https:" && OPTIMIZED_HOSTS.includes(url.hostname);
	} catch {
		return false;
	}
};
