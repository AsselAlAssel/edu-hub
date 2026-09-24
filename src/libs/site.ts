import type { Metadata } from "next";

export const SITE_URL = (
	process.env.NEXT_PUBLIC_DOMAIN || "https://www.mohammedsubuh.com"
).replace(/\/$/, "");

export const SITE_NAME = "محمد صبح للفيزياء";

const COVER = {
	url: "/images/cover.png",
	width: 1200,
	height: 630,
	alt: "شروحات الفيزياء - محمد صبح",
};

/** Page metadata with canonical URL + matching Open Graph/Twitter cards. */
export function pageMetadata({
	title,
	description,
	path,
	keywords,
	noIndex,
}: {
	title: string;
	description: string;
	path: string;
	keywords?: string[];
	noIndex?: boolean;
}): Metadata {
	return {
		title,
		description,
		keywords,
		alternates: { canonical: path },
		robots: noIndex ? { index: false, follow: false } : undefined,
		openGraph: {
			title,
			description,
			url: path,
			siteName: SITE_NAME,
			type: "website",
			locale: "ar_AR",
			images: [COVER],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [COVER.url],
			creator: "@mohammedsubuh",
		},
	};
}
