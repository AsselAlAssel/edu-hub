export const ICONS_FORMAT_FILE = [
	"jpg",
	"mp4",
	"mp3",
	"pdf",
	"docx",
	"xlsx",
	"ppt",
	"txt",
];

export const youtubeRegex =
	// eslint-disable-next-line no-useless-escape
	/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&=%\?]{11})/;

export function isYouTubeVideo(url: string) {
	return youtubeRegex.test(url);
}
export function getYouTubeVideoID(url: string) {
	const regex =
		// eslint-disable-next-line no-useless-escape
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
	const match = url.match(regex);
	return match ? match[1] : null;
}
