import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl =
		process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com";
	const pages = ["classes"];

	const sitemap = pages.map((page) => {
		return {
			url: `${baseUrl}/${page}`,
			lastModified: new Date(),
		};
	});
	return [
		{
			url: baseUrl,
			lastModified: new Date(),
		},
		...sitemap,
	];
}
