import axios from "axios";

export type UpdateLandingPageInput = {
	headerTitle: string;
	headerSubtitle?: string;
	headerImage?: string;
	landingVideo?: string;
	landingVideoId?: string;
	aboutTitle: string;
	aboutSubtitle?: string;
	aboutImage?: string;
	whatsAppNumber: string;
	address: string;
	email: string;
};

export async function updateLandingPageRequest(
	key: string,
	arg: UpdateLandingPageInput
) {
	const response = await axios.put(key, arg);
	return response.data;
}
