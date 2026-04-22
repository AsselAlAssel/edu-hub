/** أقسام الصفحة الرئيسية المرتبطة بروابط الهيدر و scroll spy */
export const LANDING_NAV_SECTION_IDS = ["home", "about", "contact"] as const;
export type LandingSectionId = (typeof LANDING_NAV_SECTION_IDS)[number];
