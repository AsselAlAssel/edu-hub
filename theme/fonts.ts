import { Tajawal } from "next/font/google";

/** Original app font (Arabic). */
export const tajawalFont = Tajawal({
	weight: ["400", "500", "700", "800"],
	subsets: ["arabic"],
	display: "swap",
});

export const appBodyFontClassName = tajawalFont.className;

export const appFontStack = `${tajawalFont.style.fontFamily}, sans-serif`;
