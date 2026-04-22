import {
	updateLandingPageRequest,
	type UpdateLandingPageInput,
} from "@/services/landing.service";
import useSWRMutation from "swr/mutation";

const updateLandingPage = async (
	key: string,
	{ arg }: { arg: UpdateLandingPageInput }
) => {
	return updateLandingPageRequest(key, arg);
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
