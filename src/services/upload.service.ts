import axios from "axios";

/** رفع الملف إلى رابط موقّع (نفس خيارات axios السابقة). */
export async function putFileToPresignedUrl(url: string, file: File) {
	return axios.put(url, file, {
		headers: {
			"Content-Type": file.type,
		},
	});
}
