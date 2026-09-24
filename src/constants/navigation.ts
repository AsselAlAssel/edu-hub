import type { LandingSectionId } from "@/types/landingNav";

export type NavItem = {
	label: string;
	href: string;
	/** Landing section this link targets (active via scroll spy on "/"). */
	section?: LandingSectionId;
	/** Path prefixes that mark this link active on other pages. */
	match?: string[];
};

export const NAV_ITEMS: NavItem[] = [
	{ label: "الرئيسية", href: "/#home", section: "home" },
	{ label: "الصفوف", href: "/classes", match: ["/classes", "/class/"] },
	{ label: "عن المنصة", href: "/#about", section: "about" },
	{ label: "تواصل معنا", href: "/#contact", section: "contact" },
];

export function isNavItemActive(
	item: NavItem,
	pathname: string,
	activeSection: LandingSectionId | null
) {
	if (item.section) return pathname === "/" && activeSection === item.section;
	return !!item.match?.some((prefix) => pathname.startsWith(prefix));
}
