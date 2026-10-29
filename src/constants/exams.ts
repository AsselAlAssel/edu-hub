/** When an exam shows to students; shared by the API validation and the admin UI. */
export const UNLOCK_RULES = {
	ALWAYS: { label: "متاح دائماً", color: "success" },
	FOLDER: { label: "بعد إنهاء فيديوهات المجلد", color: "warning" },
	TREE: { label: "بعد إنهاء كل ما داخل المجلد", color: "info" },
} as const;
export type UnlockRule = keyof typeof UNLOCK_RULES;

export const isUnlockRule = (value: unknown): value is UnlockRule =>
	typeof value === "string" && Object.hasOwn(UNLOCK_RULES, value);

/** SWR key of a folder's exams panel (their lock state follows video progress). */
export const folderExamsKey = (folderId: string) =>
	`/api/folder/${folderId}/exams`;
export const isFolderExamsKey = (key: unknown) =>
	typeof key === "string" && /^\/api\/folder\/[^/]+\/exams$/.test(key);
