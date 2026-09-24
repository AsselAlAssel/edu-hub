import { SITE_NAME, SITE_URL } from "@/libs/site";

type Json = Record<string, unknown>;

/**
 * Structured data (schema.org) for search engines. Server-rendered; `<` is
 * escaped so CMS text can never close the script tag.
 */
export default function JsonLd({ data }: { data: Json | Json[] }) {
	return (
		<script
			type='application/ld+json'
			dangerouslySetInnerHTML={{
				__html: JSON.stringify(data).replace(/</g, "\\u003c"),
			}}
		/>
	);
}

const SOCIAL = [
	"https://www.youtube.com/@mohammadsubuh",
	"https://www.facebook.com/profile.php?id=100088599626669",
];

export const TEACHER = {
	"@type": "Person",
	name: "محمد صبح",
	alternateName: "Mohammed Subuh",
	jobTitle: "أستاذ فيزياء",
	sameAs: SOCIAL,
} as const;

/** Site-wide identity: the website + the educational organisation behind it. */
export function siteJsonLd({ email }: { email?: string | null } = {}): Json[] {
	return [
		{
			"@context": "https://schema.org",
			"@type": "WebSite",
			name: SITE_NAME,
			url: SITE_URL,
			inLanguage: "ar",
		},
		{
			"@context": "https://schema.org",
			"@type": "EducationalOrganization",
			name: SITE_NAME,
			url: SITE_URL,
			logo: `${SITE_URL}/images/logo/logo.svg`,
			sameAs: SOCIAL,
			founder: TEACHER,
			...(email ? { email } : {}),
		},
	];
}

/** One Course per class (real classes only). */
export function coursesJsonLd(
	classes: {
		id: string;
		name: string;
		description?: string | null;
		url: string;
	}[]
): Json {
	return {
		"@context": "https://schema.org",
		"@type": "ItemList",
		itemListElement: classes.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			item: {
				"@type": "Course",
				name: item.name,
				description:
					item.description ||
					`شروحات فيزياء ${item.name} من إعداد الأستاذ محمد صبح.`,
				url: item.url,
				inLanguage: "ar",
				provider: {
					"@type": "EducationalOrganization",
					name: SITE_NAME,
					url: SITE_URL,
				},
			},
		})),
	};
}

/** Breadcrumb trail: home › classes › class › … folder. */
export function breadcrumbJsonLd(trail: { name: string; url: string }[]): Json {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: trail.map((crumb, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: crumb.name,
			item: crumb.url,
		})),
	};
}
