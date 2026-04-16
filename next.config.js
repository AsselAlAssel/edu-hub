/** @type {import('next').NextConfig} */

const nextConfig = {
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
				source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/_next/static/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},
};

module.exports = nextConfig;
