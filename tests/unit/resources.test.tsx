import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { File as DbFile, Folder, Video } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AttachmentsForm from "@/components/AttachmentsForm";
import { ResourcesSkeleton } from "@/components/ui/Skeletons";
import { LoadingState } from "@/components/ui/States";
import VideoForm from "@/components/VideoForm";
import ResourcesPage, {
	summarizeResources,
} from "@/scenes/ResourcesPage/ResourcesPage";
import { moveResourceItem } from "@/services/move.service";
import { asAdmin, asUser, oid, renderWithTheme } from "../utils";

vi.mock("@/services/move.service", () => ({
	moveResourceItem: vi.fn(async () => ({})),
}));
vi.mock("@/services/reorder.service", () => ({
	reorderItem: vi.fn(async () => ({})),
}));
vi.mock("@/services/resource.service", () => ({
	fetchResources: vi.fn(async () => ({ folders: [], files: [], videos: [] })),
	postFile: vi.fn(),
	postVideo: vi.fn(),
	deleteFileRequest: vi.fn(),
	deleteVideoRequest: vi.fn(),
	updateFileNameRequest: vi.fn(),
	updateVideoNameRequest: vi.fn(),
}));

const hookState = vi.hoisted(() => ({
	override: null as null | Record<string, unknown>,
}));
vi.mock("@/hooks/useResourceApi", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/hooks/useResourceApi")>();
	return {
		...actual,
		useResource: (args: Parameters<typeof actual.useResource>[0]) =>
			hookState.override ?? actual.useResource(args),
	};
});

const CLASS_ID = oid("c");
const ROOT_ID = oid("r");
const CURRENT_ID = oid("1");

const folder = (n: string, name: string): Folder =>
	({
		id: oid(n),
		name,
		classId: CLASS_ID,
		parentFolderId: CURRENT_ID,
		rank: n,
		isRoot: false,
	}) as Folder;
const file = (
	n: string,
	name: string,
	type = "pdf",
	url = "https://files.test/k"
): DbFile =>
	({
		id: oid(n),
		name,
		type,
		url,
		classId: CLASS_ID,
		folderId: CURRENT_ID,
		rank: n,
	}) as DbFile;
const video = (n: string, name: string): Video =>
	({
		id: oid(n),
		name,
		url: "https://youtu.be/dQw4w9WgXcQ",
		videoId: "dQw4w9WgXcQ",
		thumbnailUrl: "",
		classId: CLASS_ID,
		folderId: CURRENT_ID,
		rank: n,
	}) as Video;

const resources = {
	folders: [folder("2", "الوحدة الأولى"), folder("3", "الوحدة الثانية")],
	files: [file("4", "ملخص الحركة"), file("5", "ورقة مغلقة", "docx", "#")],
	videos: [video("6", "قوانين نيوتن")],
};

const renderPage = (data = resources) =>
	renderWithTheme(
		<ResourcesPage
			resources={data}
			folderId={CURRENT_ID}
			isRootFolder={false}
			className='الصف العاشر'
			classId={CLASS_ID}
			breadcrumb={[
				{ id: ROOT_ID, name: "Root Folder" },
				{ id: CURRENT_ID, name: "الفصل الأول" },
			]}
		/>
	);

beforeEach(() => {
	hookState.override = null;
	asUser();
});

describe("resource explorer (student)", () => {
	it("titles the page with the folder and summarises real counts", () => {
		renderPage();
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"الفصل الأول"
		);
		expect(
			screen.getByText("2 مجلدات · 1 فيديو · 2 ملفات")
		).toBeInTheDocument();
		expect(summarizeResources({ folders: [], files: [], videos: [] })).toBe("");
	});

	it("breadcrumbs: Classes › class › current (aria-current)", () => {
		renderPage();
		const trail = screen.getByRole("navigation", { name: "مسار التنقل" });
		expect(within(trail).getByRole("link", { name: "الصفوف" })).toHaveAttribute(
			"href",
			"/classes"
		);
		expect(
			within(trail).getByRole("link", { name: "الصف العاشر" })
		).toHaveAttribute("href", `/class/${CLASS_ID}/folder/${ROOT_ID}`);
		expect(within(trail).getByText("الفصل الأول")).toHaveAttribute(
			"aria-current",
			"page"
		);
	});

	it("folder cards navigate into sub-folders", () => {
		renderPage();
		expect(screen.getByRole("link", { name: "الوحدة الأولى" })).toHaveAttribute(
			"href",
			`/class/${CLASS_ID}/folder/${oid("2")}`
		);
	});

	it("files download in a new tab; closed files are not links", () => {
		renderPage();
		const download = screen.getByRole("link", { name: /تحميل ملخص الحركة/ });
		expect(download).toHaveAttribute("href", "https://files.test/k");
		expect(download).toHaveAttribute("rel", "noopener noreferrer");
		expect(screen.queryByRole("link", { name: /ورقة مغلقة/ })).toBeNull();
		expect(screen.getByText("غير متاح")).toBeInTheDocument();
	});

	it("shows no admin controls to regular users", () => {
		renderPage();
		expect(screen.queryByRole("button", { name: /إعادة ترتيب/ })).toBeNull();
		expect(screen.queryByRole("button", { name: /خيارات/ })).toBeNull();
		expect(screen.queryByRole("button", { name: "إضافة محتوى" })).toBeNull();
		expect(
			screen.getByRole("button", { name: "تشغيل الفيديو: قوانين نيوتن" })
		).toBeInTheDocument();
	});

	it("empty folder → friendly empty state", () => {
		renderPage({ folders: [], files: [], videos: [] });
		expect(screen.getByText("لا يوجد محتوى هنا بعد")).toBeInTheDocument();
	});

	it("error without data → error state with retry", () => {
		hookState.override = {
			data: undefined,
			error: new Error("boom"),
			mutate: vi.fn(),
		};
		renderPage();
		expect(screen.getByRole("alert")).toHaveTextContent("تعذّر تحميل المحتوى");
		expect(
			screen.getByRole("button", { name: "إعادة المحاولة" })
		).toBeInTheDocument();
	});
});

describe("resource explorer (admin)", () => {
	beforeEach(() => asAdmin());

	it("exposes labelled drag handles, action menus and add cards", () => {
		renderPage();
		expect(
			screen.getByRole("button", { name: "إعادة ترتيب المجلد: الوحدة الأولى" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "إعادة ترتيب الملف: ملخص الحركة" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "خيارات الفيديو: قوانين نيوتن" })
		).toBeInTheDocument();
		expect(
			screen.getByRole("button", { name: "مجلد جديد" })
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "رفع ملف" })).toBeInTheDocument();
	});

	it("rename dialog opens pre-filled with the current name", async () => {
		renderPage();
		await userEvent.click(
			screen.getByRole("button", { name: "خيارات الملف: ملخص الحركة" })
		);
		await userEvent.click(
			await screen.findByRole("menuitem", { name: "إعادة تسمية الملف" })
		);
		const dialog = await screen.findByRole("dialog", {
			name: "إعادة تسمية الملف",
		});
		expect(within(dialog).getByLabelText(/الاسم الجديد/)).toHaveValue(
			"ملخص الحركة"
		);
	});

	it("delete confirmation names the item and warns about nested content", async () => {
		renderPage();
		await userEvent.click(
			screen.getByRole("button", { name: "خيارات المجلد: الوحدة الأولى" })
		);
		await userEvent.click(
			await screen.findByRole("menuitem", { name: "حذف المجلد" })
		);
		const dialog = await screen.findByRole("dialog", { name: "حذف المجلد" });
		expect(dialog).toHaveTextContent("«الوحدة الأولى» مع كل ما بداخله");
		expect(within(dialog).getByRole("button", { name: "إلغاء" })).toHaveFocus();
	});

	it("moves a video to a folder from the keyboard-accessible menu", async () => {
		renderPage();
		await userEvent.click(
			screen.getByRole("button", { name: "خيارات الفيديو: قوانين نيوتن" })
		);
		await userEvent.click(
			await screen.findByRole("menuitem", { name: "نقل إلى مجلد" })
		);
		const dialog = await screen.findByRole("dialog", { name: "نقل إلى مجلد" });
		await userEvent.click(
			within(dialog).getByRole("radio", { name: "الوحدة الثانية" })
		);
		await userEvent.click(within(dialog).getByRole("button", { name: "نقل" }));
		await vi.waitFor(() =>
			expect(moveResourceItem).toHaveBeenCalledWith({
				type: "video",
				id: oid("6"),
				targetFolderId: oid("3"),
			})
		);
	});

	it("empty folder → admin quick-add actions", () => {
		renderPage({ folders: [], files: [], videos: [] });
		expect(screen.getByText("هذا المجلد فارغ")).toBeInTheDocument();
		expect(
			screen.getAllByRole("button", { name: /مجلد جديد|إضافة فيديو|رفع ملف/ })
				.length
		).toBeGreaterThanOrEqual(3);
	});
});

describe("resource dialogs", () => {
	it("video form validates YouTube URLs and submits the parsed id", async () => {
		const onSubmit = vi.fn(async () => {});
		renderWithTheme(
			<VideoForm open handleClose={() => {}} onSubmit={onSubmit} busy={false} />
		);
		await userEvent.type(
			screen.getByLabelText(/رابط يوتيوب/),
			"https://vimeo.com/42"
		);
		await userEvent.type(screen.getByLabelText(/عنوان الفيديو/), "درس");
		await userEvent.click(
			screen.getByRole("button", { name: "إضافة الفيديو" })
		);
		expect(
			await screen.findByText("أدخل رابط فيديو صالحاً من يوتيوب")
		).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();

		const url = screen.getByLabelText(/رابط يوتيوب/);
		await userEvent.clear(url);
		await userEvent.type(url, "https://youtu.be/dQw4w9WgXcQ");
		expect(screen.getByAltText("معاينة صورة الفيديو")).toBeInTheDocument();
		await userEvent.click(
			screen.getByRole("button", { name: "إضافة الفيديو" })
		);
		await vi.waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				name: "درس",
				url: "https://youtu.be/dQw4w9WgXcQ",
				videoId: "dQw4w9WgXcQ",
			})
		);
	});

	it("upload form rejects unsupported files before any request", async () => {
		const onSubmit = vi.fn(async () => {});
		renderWithTheme(
			<AttachmentsForm
				open
				handleClose={() => {}}
				onSubmit={onSubmit}
				busy={false}
			/>
		);
		const input = screen.getByLabelText("اختيار ملف");
		await userEvent.upload(
			input,
			new File(["x"], "setup.exe", { type: "application/octet-stream" })
		);
		expect(await screen.findByRole("alert")).toHaveTextContent(
			"نوع الملف غير مدعوم"
		);
		await userEvent.click(screen.getByRole("button", { name: "رفع الملف" }));
		expect(onSubmit).not.toHaveBeenCalled();

		await userEvent.upload(
			input,
			new File(["%PDF"], "unit-1.pdf", { type: "application/pdf" })
		);
		expect(await screen.findByLabelText(/الاسم الظاهر للطلاب/)).toHaveValue(
			"unit-1.pdf"
		);
		await userEvent.click(screen.getByRole("button", { name: "رفع الملف" }));
		await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
	});

	it("loading states are announced / hidden correctly", () => {
		renderWithTheme(
			<>
				<LoadingState />
				<ResourcesSkeleton />
			</>
		);
		expect(screen.getByRole("status")).toHaveTextContent("جارٍ التحميل");
	});
});
