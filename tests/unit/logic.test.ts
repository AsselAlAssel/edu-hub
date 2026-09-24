// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("@/libs/prismaDb", () => ({ prisma: {} }));

import { isObjectId } from "@/libs/api";
import { getYouTubeVideoID } from "@/libs/constant";
import { parseLandingPayload } from "@/libs/landing";
import { getExtension, validateUpload } from "@/libs/uploadRules";
import { isNavItemActive, NAV_ITEMS } from "@/constants/navigation";
import {
	computeReorder,
	removeItem,
	renameItem,
	resolveDrop,
	type ResourceData,
} from "@/scenes/ResourcesPage/resourceDnd";
import { colors, cssVariables } from "../../theme/tokens";

const id = (c: string) => c.repeat(24);
const MB = 1024 * 1024;

describe("isObjectId", () => {
	it("accepts 24-char hex only", () => {
		expect(isObjectId("65f0c3b2a1d4e5f60718293a")).toBe(true);
		expect(isObjectId("65f0c3b2a1d4e5f60718293")).toBe(false);
		expect(isObjectId("zzzzzzzzzzzzzzzzzzzzzzzz")).toBe(false);
		expect(isObjectId(undefined)).toBe(false);
		expect(isObjectId({ $ne: null })).toBe(false);
	});
});

describe("upload validation", () => {
	it("accepts allowed types within size", () => {
		expect(validateUpload({ name: "lesson.PDF", size: 2 * MB })).toBeNull();
		expect(
			validateUpload({ name: "cover.webp", size: MB }, "image")
		).toBeNull();
	});
	it("rejects unknown types, oversize and empty files", () => {
		expect(validateUpload({ name: "virus.exe", size: MB })).toMatch(
			/غير مدعوم/
		);
		expect(validateUpload({ name: "noext", size: MB })).toMatch(/غير مدعوم/);
		expect(validateUpload({ name: "big.mp4", size: 201 * MB })).toMatch(
			/يتجاوز/
		);
		expect(validateUpload({ name: "a.pdf", size: 0 })).toMatch(/فارغ/);
		expect(validateUpload({ name: "doc.pdf", size: MB }, "image")).toMatch(
			/غير مدعوم/
		);
		expect(
			validateUpload({ name: "huge.png", size: 11 * MB }, "image")
		).toMatch(/يتجاوز/);
	});
	it("extracts lower-case extensions", () => {
		expect(getExtension("Unit 1.DOCX")).toBe("docx");
		expect(getExtension(".bashrc")).toBe("");
	});
});

describe("YouTube URL parsing", () => {
	it.each([
		["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "dQw4w9WgXcQ"],
		["https://youtu.be/dQw4w9WgXcQ?t=10", "dQw4w9WgXcQ"],
		["https://www.youtube.com/embed/dQw4w9WgXcQ", "dQw4w9WgXcQ"],
		["https://vimeo.com/123", null],
		["not a url", null],
	])("%s → %s", (url, expected) => {
		expect(getYouTubeVideoID(url)).toBe(expected);
	});
});

describe("landing CMS payload", () => {
	const valid = {
		headerTitle: " مرحباً ",
		aboutTitle: "عن المنصة",
		whatsAppNumber: "+972 597-408236",
		address: "نابلس",
		email: "a@b.co",
		landingVideo: "https://youtu.be/dQw4w9WgXcQ",
	};
	it("normalises and derives the video id", () => {
		const parsed = parseLandingPayload(valid);
		expect("data" in parsed && parsed.data).toMatchObject({
			headerTitle: "مرحباً",
			whatsAppNumber: "972597408236",
			landingVideoId: "dQw4w9WgXcQ",
			headerSubtitle: null,
		});
	});
	it("rejects missing fields, bad email, bad phone and non-YouTube video", () => {
		expect(parseLandingPayload({ ...valid, aboutTitle: "" })).toEqual({
			error: "Missing Fields",
		});
		expect(parseLandingPayload({ ...valid, email: "nope" })).toEqual({
			error: "Invalid email",
		});
		expect(parseLandingPayload({ ...valid, whatsAppNumber: "12ab" })).toEqual({
			error: "Invalid WhatsApp number",
		});
		expect(
			parseLandingPayload({ ...valid, landingVideo: "https://vimeo.com/1" })
		).toEqual({ error: "Invalid YouTube url" });
	});
	it("clears the video when the URL is removed", () => {
		const parsed = parseLandingPayload({ ...valid, landingVideo: "" });
		expect("data" in parsed && parsed.data?.landingVideoId).toBeNull();
	});
});

describe("resource drag & drop", () => {
	const data = {
		folders: [
			{ id: id("1"), name: "F1", rank: "a" },
			{ id: id("2"), name: "F2", rank: "b" },
		],
		files: [
			{ id: id("3"), name: "A", rank: "a" },
			{ id: id("4"), name: "B", rank: "b" },
			{ id: id("5"), name: "C", rank: "c" },
		],
		videos: [{ id: id("6"), name: "V", rank: "a" }],
	} as unknown as ResourceData;

	it("reorders and reports the new neighbours' ranks", () => {
		const result = computeReorder(data.files, id("3"), id("5"));
		expect(result?.sorted.map((f) => f.id)).toEqual([
			id("4"),
			id("5"),
			id("3"),
		]);
		expect(result).toMatchObject({ beforeRank: "c", afterRank: null });
		expect(computeReorder(data.files, id("3"), id("3"))).toBeNull();
	});

	it("dropping a file or video on a folder is a move", () => {
		expect(resolveDrop(data, id("4"), id("2"))).toEqual({
			type: "move",
			kind: "file",
			id: id("4"),
			targetFolderId: id("2"),
		});
		expect(resolveDrop(data, id("6"), id("1"))).toMatchObject({
			type: "move",
			kind: "video",
		});
	});

	it("same-kind drops reorder; mixed or empty drops do nothing", () => {
		expect(resolveDrop(data, id("2"), id("1"))).toMatchObject({
			type: "reorder",
			kind: "folder",
		});
		expect(resolveDrop(data, id("1"), id("4"))).toEqual({ type: "none" });
		expect(resolveDrop(data, id("3"), id("6"))).toEqual({ type: "none" });
		expect(resolveDrop(data, id("3"), null)).toEqual({ type: "none" });
	});

	it("optimistic helpers are immutable", () => {
		const removed = removeItem(data, "file", id("3"));
		expect(removed.files).toHaveLength(2);
		expect(data.files).toHaveLength(3);
		expect(renameItem(data, "video", id("6"), "جديد").videos[0].name).toBe(
			"جديد"
		);
		expect(data.videos[0].name).toBe("V");
	});
});

describe("navigation", () => {
	it("marks landing sections only on / and classes on class pages", () => {
		const [home, classes] = NAV_ITEMS;
		expect(isNavItemActive(home, "/", "home")).toBe(true);
		expect(isNavItemActive(home, "/classes", "home")).toBe(false);
		expect(isNavItemActive(classes, "/class/x/folder/y", null)).toBe(true);
	});
});

describe("design tokens", () => {
	it("exposes the Neon Physics palette as CSS variables for both modes", () => {
		const css = cssVariables();
		expect(css).toContain(`--qa-bg:${colors.light.bg}`);
		expect(css).toContain(`html.dark{--qa-bg:${colors.dark.bg}`);
		expect(css).toContain("--qa-radius-xl:26px");
		expect(css).toContain("--qa-gradient-text:");
		expect(colors.dark.bg).toBe("#050816");
		expect(colors.dark.cyan).toBe("#22D3EE");
		expect(colors.light.bg).toBe("#EBF2F8");
		expect(colors.light.azure).toBe("#2563EB");
	});

	// WCAG AA (4.5:1) for body text and primary buttons in both modes.
	it("keeps text and primary-button contrast at WCAG AA", () => {
		const luminance = (hex: string) => {
			const [r, g, b] = [1, 3, 5].map((i) => {
				const c = parseInt(hex.slice(i, i + 2), 16) / 255;
				return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
			});
			return 0.2126 * r + 0.7152 * g + 0.0722 * b;
		};
		const ratio = (a: string, b: string) => {
			const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
			return (hi + 0.05) / (lo + 0.05);
		};
		for (const mode of ["light", "dark"] as const) {
			const c = colors[mode];
			expect(ratio(c.textPrimary, c.bg)).toBeGreaterThanOrEqual(4.5);
			expect(ratio(c.textSecondary, c.surface)).toBeGreaterThanOrEqual(4.5);
			expect(ratio(c.textMuted, c.surface)).toBeGreaterThanOrEqual(4.5);
			// Gradient CTAs: every stop must carry the button label.
			for (const stop of [c.cyan, c.azure])
				expect(ratio(c.onPrimary, stop)).toBeGreaterThanOrEqual(4.5);
		}
	});
});
