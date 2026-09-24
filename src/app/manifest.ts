import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/libs/site";
import { colors } from "../../theme/tokens";

/** Installable app metadata (home-screen name, colours, icon). */
export default function manifest(): MetadataRoute.Manifest {
	return {
		name: `${SITE_NAME} — شروحات الفيزياء`,
		short_name: "محمد صبح",
		description:
			"شروحات فيديو وملفات فيزياء منظّمة لكل صف من إعداد الأستاذ محمد صبح.",
		lang: "ar",
		dir: "rtl",
		start_url: "/",
		display: "standalone",
		background_color: colors.dark.bg,
		theme_color: colors.dark.bg,
		icons: [
			{ src: "/images/logo/logo.svg", sizes: "any", type: "image/svg+xml" },
			{ src: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
		],
	};
}
