import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resourceSummary } from "@/components/Admin/Classes/ClassItem";
import type { ClassWithMeta } from "@/libs/class";
import ClassesPage from "@/scenes/ClassesPage/ClassesPage";
import { fetchAllClasses } from "@/services/class.service";
import { asAdmin, asGuest, asUser, oid, renderWithTheme } from "../utils";

// Admins refetch the list on mount; without a server that request fails and
// the page swaps the cards for an error state.
vi.mock("@/services/class.service", async (original) => ({
	...(await original<object>()),
	fetchAllClasses: vi.fn(async () => []),
}));

beforeEach(() => {
	asGuest();
});

const makeClass = (
	n: number,
	extra: Partial<ClassWithMeta> = {}
): ClassWithMeta =>
	({
		id: oid(String(n)),
		name: `الصف ${n}`,
		description: "",
		image: null,
		createdAt: new Date(),
		updatedAt: new Date(),
		folders: [{ id: oid(`${n}f`) }],
		_count: { files: 0, videos: 0 },
		...extra,
	}) as unknown as ClassWithMeta;

describe("classes catalog", () => {
	it("lists classes as keyboard-reachable links to their root folder", () => {
		renderWithTheme(<ClassesPage classes={[makeClass(1), makeClass(2)]} />);
		const link = screen.getByRole("link", { name: "الصف 1" });
		expect(link).toHaveAttribute(
			"href",
			`/class/${oid("1")}/folder/${oid("1f")}`
		);
		expect(screen.getAllByRole("listitem")).toHaveLength(2);
	});

	it("shows real resource counts only when present", () => {
		expect(resourceSummary({ videos: 3, files: 1 })).toBe("3 فيديوهات · 1 ملف");
		expect(resourceSummary({ videos: 0, files: 0 })).toBeNull();
		renderWithTheme(
			<ClassesPage
				classes={[makeClass(1, { _count: { files: 2, videos: 1 } } as never)]}
			/>
		);
		expect(screen.getByText("1 فيديو · 2 ملفات")).toBeInTheDocument();
	});

	it("shows an empty state (no admin CTA for students)", () => {
		asUser();
		renderWithTheme(<ClassesPage classes={[]} />);
		expect(screen.getByText("لا توجد صفوف بعد")).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /إنشاء صف جديد/ })).toBeNull();
	});

	it("gives admins create and per-class actions; regular users see none", async () => {
		asUser();
		const { unmount } = renderWithTheme(
			<ClassesPage classes={[makeClass(1)]} />
		);
		expect(screen.queryByRole("button", { name: /خيارات الصف/ })).toBeNull();
		unmount();

		asAdmin();
		vi.mocked(fetchAllClasses).mockResolvedValue([makeClass(1)]);
		renderWithTheme(<ClassesPage classes={[makeClass(1)]} />);
		expect(
			screen.getByRole("button", { name: /إنشاء صف جديد/ })
		).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("button", { name: "خيارات الصف: الصف 1" })
		);
		await userEvent.click(
			await screen.findByRole("menuitem", { name: "حذف الصف" })
		);
		expect(
			await screen.findByRole("dialog", { name: "حذف الصف" })
		).toHaveTextContent("«الصف 1»");
	});
});
