import { cleanString } from "./api";
import { getYouTubeVideoID } from "./constant";

const optional = (value: unknown, maxLength = 2000) =>
	typeof value === "string" && value.trim()
		? value.trim().slice(0, maxLength)
		: null;

/** Validates the CMS payload; returns an error message or the data to persist. */
export function parseLandingPayload(body: Record<string, any>) {
	const headerTitle = cleanString(body.headerTitle, 200);
	const aboutTitle = cleanString(body.aboutTitle, 200);
	const address = cleanString(body.address, 300);
	const email = cleanString(body.email, 200);
	const whatsAppNumber = cleanString(body.whatsAppNumber, 30)?.replace(
		/[\s+-]/g,
		""
	);

	if (!headerTitle || !aboutTitle || !whatsAppNumber || !address || !email) {
		return { error: "Missing Fields" } as const;
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return { error: "Invalid email" } as const;
	}
	if (!/^\d{6,15}$/.test(whatsAppNumber)) {
		return { error: "Invalid WhatsApp number" } as const;
	}

	const landingVideo = optional(body.landingVideo, 500);
	const landingVideoId = landingVideo ? getYouTubeVideoID(landingVideo) : null;
	if (landingVideo && !landingVideoId) {
		return { error: "Invalid YouTube url" } as const;
	}

	return {
		data: {
			headerTitle,
			headerSubtitle: optional(body.headerSubtitle, 600),
			headerImage: optional(body.headerImage),
			landingVideo,
			landingVideoId,
			aboutTitle,
			aboutSubtitle: optional(body.aboutSubtitle, 3000),
			aboutImage: optional(body.aboutImage),
			whatsAppNumber,
			address,
			email,
		},
	} as const;
}
