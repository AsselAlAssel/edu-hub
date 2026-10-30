import { act, screen, within } from "@testing-library/react";
import type { Video } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ResourcesPage from "@/scenes/ResourcesPage/ResourcesPage";
import { asUser, oid, renderWithTheme } from "../utils";

const state = vi.hoisted(() => ({
	data: null as unknown,
	isLoading: true,
	rerender: () => {},
}));
vi.mock("@/hooks/useResourceApi", async () => {
	const { useReducer } = await import("react");
	return {
		useResource: () => {
			state.rerender = useReducer((n: number) => n + 1, 0)[1];
			return {
				data: state.data,
				error: null,
				isLoading: state.isLoading,
				mutate: async () => state.data,
			};
		},
	};
});
vi.mock("@/hooks/useProgress", async (importOriginal) => ({
	...(await importOriginal<typeof import("@/hooks/useProgress")>()),
	default: () => ({
		signedIn: true,
		ready: true,
		items: [],
		byVideo: new Map(),
		save: vi.fn(),
	}),
	useWatchTracker: () => ({
		start: vi.fn(),
		stop: vi.fn(),
		onProgress: vi.fn(),
	}),
}));

const CLASS_ID = oid("c");
const UNIT_ID = oid("1");
const VIDEO_ID = oid("7");
const bunny = (locked: boolean) =>
	({
		id: VIDEO_ID,
		name: "شرح مدفوع",
		url: "",
		videoId: "",
		thumbnailUrl: "",
		classId: CLASS_ID,
		folderId: UNIT_ID,
		rank: "7",
		isBunny: true,
		locked,
	}) as unknown as Video;
const resources = (locked: boolean) => ({
	folders: [],
	files: [],
	videos: [bunny(locked)],
	access: {
		unit: { id: UNIT_ID, name: "الوحدة الأولى", price: 100 },
		canOpen: !locked,
		ownedUnitIds: locked ? [] : [UNIT_ID],
		whatsAppNumber: null,
	},
});

beforeEach(() => {
	asUser();
	window.history.replaceState({}, "", `/?v=${VIDEO_ID}`);
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response("{}", { status: 401 }))
	);
});
afterEach(() => vi.unstubAllGlobals());

describe("?v= deep link into a paid unit", () => {
	it("waits for the viewer's own resources before choosing player or paywall", async () => {
		state.data = resources(true); // the cached guest view
		state.isLoading = true;
		renderWithTheme(
			<ResourcesPage
				resources={resources(true) as never}
				folderId={UNIT_ID}
				isRootFolder={false}
				className='العاشر'
				classId={CLASS_ID}
				breadcrumb={[{ id: UNIT_ID, name: "الوحدة الأولى" }]}
			/>
		);
		// Owner, but their data has not arrived: no paywall yet.
		expect(screen.queryByRole("dialog")).toBeNull();

		await act(async () => {
			state.data = resources(false);
			state.isLoading = false;
			state.rerender();
		});
		const dialog = await screen.findByRole("dialog");
		expect(within(dialog).queryByText("100 ₪")).toBeNull();
		// The playback route said 401: the player offers sign-in, not a dead retry.
		expect(
			await within(dialog).findByRole("button", { name: "تسجيل الدخول" })
		).toBeInTheDocument();
	});
});
