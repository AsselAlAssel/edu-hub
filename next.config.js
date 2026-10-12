/** @type {import('next').NextConfig} */

const nextConfig = {
	// Lets verification builds run beside a live `next dev` (which owns .next).
	distDir: process.env.NEXT_DIST_DIR || ".next",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
				port: "",
				pathname: "**",
			},
			{
				protocol: "http",
				hostname: "**",
				port: "",
				pathname: "**",
			},
		],
		formats: ["image/avif", "image/webp"],
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
