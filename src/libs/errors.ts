import { isAxiosError } from "axios";

const STATUS_MESSAGES: Record<number, string> = {
	400: "البيانات المُدخلة غير صالحة.",
	401: "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى.",
	403: "ليست لديك صلاحية لتنفيذ هذا الإجراء.",
	404: "العنصر المطلوب غير موجود أو تم حذفه.",
};

/** Arabic, user-facing message for a failed API call. */
export function getErrorMessage(
	error: unknown,
	fallback = "حدث خطأ غير متوقع"
) {
	if (!isAxiosError(error)) return fallback;
	if (!error.response) {
		return "تعذّر الاتصال بالخادم. تحقّق من اتصالك بالإنترنت.";
	}
	// The API's own message when it is written for users (Arabic), e.g.
	// "يلزم من 2 إلى 6 خيارات غير فارغة"; English ones are for developers.
	const message = (error.response.data as { message?: unknown } | undefined)
		?.message;
	if (typeof message === "string" && /[؀-ۿ]/.test(message)) return message;
	return STATUS_MESSAGES[error.response.status] ?? fallback;
}
