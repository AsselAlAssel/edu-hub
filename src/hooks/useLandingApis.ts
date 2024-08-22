import axios from "axios";
import useSWRMutation from "swr/mutation";

const updateLandingPage = async (
	key: string,
	{
		arg,
	}: {
		arg: {
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
	}
) => {
	const response = await axios.put(key, arg);
	return response.data;
};

export const useUpdateLandingPage = () => {
	const { trigger, isMutating } = useSWRMutation(
		"/api/landing",
		updateLandingPage
	);

	return {
		updateLandingPage: trigger,
		isUpdating: isMutating,
	};
};
