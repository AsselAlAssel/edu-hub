import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";

/** Arabic UI font: body 400, labels 500, buttons/titles 600, headings 700. */
export const plexArabic = IBM_Plex_Sans_Arabic({
	weight: ["400", "500", "600", "700"],
	subsets: ["arabic", "latin"],
	display: "swap",
	variable: "--qa-font-arabic",
});

/** Latin fallback for English words, numbers and formulas inside Arabic text. */
export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--qa-font-latin",
});

export const appBodyFontClassName = `${plexArabic.variable} ${inter.variable} ${plexArabic.className}`;

// Arabic font first: Plex Arabic also ships Latin glyphs, Inter covers the rest.
export const appFontStack = `${plexArabic.style.fontFamily}, ${inter.style.fontFamily}, "Segoe UI", Tahoma, sans-serif`;
