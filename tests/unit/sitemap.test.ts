// @vitest-environment node
import { folderSitemapEntries, type FolderRow } from "@/libs/sitemap";
import { describe, expect, it } from "vitest";

const at = new Date("2026-01-01");
const folder = (
	id: string,
	parentFolderId: string | null,
	classId = "c1"
): FolderRow => ({
	id,
	classId,
	parentFolderId,
	isRoot: parentFolderId === null,
	updatedAt: at,
});

const paths = (rows: FolderRow[]) =>
	folderSitemapEntries(rows).map((entry) =>
		new URL(entry.url).pathname.replace(/^\/class\/\w+\/folder\//, "")
	);

describe("sitemap folder entries", () => {
	it("lists nested folders at every depth", () => {
		const rows = [
			folder("root", null),
			folder("unit1", "root"),
			folder("lesson1", "unit1"),
			folder("part1", "lesson1"),
		];
		expect(paths(rows)).toEqual(["root", "unit1", "lesson1", "part1"]);
		expect(folderSitemapEntries(rows).map((e) => e.priority)).toEqual([
			0.8, 0.6, 0.5, 0.5,
		]);
	});

	it("skips orphans and folders filed under another class", () => {
		const rows = [
			folder("root", null),
			folder("orphan", "deleted-parent"),
			folder("foreign", "root", "c2"),
		];
		expect(paths(rows)).toEqual(["root"]);
	});

	it("builds the class-scoped folder URL", () => {
		const [entry] = folderSitemapEntries([folder("root", null, "abc")]);
		expect(entry.url).toMatch(/\/class\/abc\/folder\/root$/);
		expect(entry.lastModified).toBe(at);
	});
});
