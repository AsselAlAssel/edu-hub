/** @type {import('next').NextConfig} */

const hostOf = (value) => {
	if (!value) return null;
	try {
		return new URL(value.includes("://") ? value : `https://${value}`).hostname;
	} catch {
		return null;
	}
};

/**
 * Hosts the image optimizer may fetch from. `**` let anyone spend the
 * project's optimization quota on arbitrary images. Other hosts still render,
 * unoptimized (see src/libs/images.ts). YouTube thumbnails are already small
 * JPEGs and always render unoptimized, so YouTube is deliberately not listed.
 * Extra hosts: IMAGE_HOSTS=a.com,b.com
 */
const imageHosts = [
	...new Set(
		[
			hostOf(process.env.NEXT_PUBLIC_FILES_URL),
			hostOf(process.env.NEXT_BUNNYCDN_CDN_HOSTNAME),
			process.env.NEXT_BUNNYCDN_PULL_ZONE_NAME &&
				`${process.env.NEXT_BUNNYCDN_PULL_ZONE_NAME}.b-cdn.net`,
			...(process.env.IMAGE_HOSTS || "").split(",").map((h) => h.trim()),
		].filter(Boolean)
	),
];

const nextConfig = {
	env: { NEXT_PUBLIC_IMAGE_HOSTS: imageHosts.join(",") },
	// Lets verification builds run beside a live `next dev` (which owns .next).
	distDir: process.env.NEXT_DIST_DIR || ".next",
	images: {
		remotePatterns: imageHosts.map((hostname) => ({
			protocol: "https",
			hostname,
			pathname: "/**",
		})),
		// Every (url, width, format, quality) combo is a billed transformation:
		// one format, one quality, only the widths our layouts actually request.
		formats: ["image/webp"],
		qualities: [75],
		deviceSizes: [640, 828, 1080, 1200],
		imageSizes: [384],
		// Stored objects are immutable (unique key per upload), so cache long.
		minimumCacheTTL: 2678400, // 31 days
	},
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					// Nobody can frame the site (clickjacking on sign-in / admin).
					{ key: "X-Frame-Options", value: "SAMEORIGIN" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
			{
				source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			// No rule for /_next/static: Next already sends `immutable` for hashed
			// production chunks, and forcing it in dev pins stale (unhashed) chunks.
		];
	},
};

module.exports = nextConfig;
