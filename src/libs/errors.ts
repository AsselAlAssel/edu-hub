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
	return STATUS_MESSAGES[error.response.status] ?? fallback;
}
