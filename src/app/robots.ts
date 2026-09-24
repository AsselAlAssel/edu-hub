import type { MetadataRoute } from "next";
import { SITE_URL } from "@/libs/site";

/** Public pages are indexable; admin, auth and API endpoints are not. */
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/admin", "/auth", "/api", "/error"],
		},
		sitemap: `${SITE_URL}/sitemap.xml`,
		host: SITE_URL,
	};
}
