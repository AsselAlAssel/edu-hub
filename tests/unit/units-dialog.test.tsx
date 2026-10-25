import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import type { PublicUser } from "@/libs/users";
import { parseUnitPrice } from "@/components/FolderForm/FolderForm";
import UnitsDialog from "@/scenes/ProfilerPage/components/UnitsDialog";
import { subscribeLink } from "@/scenes/ResourcesPage/components/PaywallDialog";
import { renderWithTheme } from "../utils";

vi.mock("axios", () => ({ default: { put: vi.fn(async () => ({})) } }));

const student = {
	id: "u1",
	name: "أحمد",
	email: "a@x.dev",
	unlockedUnitIds: ["stale", "unit-1"],
} as unknown as PublicUser;
const groups = [
	{
		classId: "c1",
		className: "الحادي عشر",
		units: [
			{ id: "unit-1", name: "الوحدة 1", price: 100 },
			{ id: "unit-2", name: "الوحدة 2", price: 80 },
		],
	},
];

describe("UnitsDialog", () => {
	it("saves the ticked units on sale, dropping stale ids", async () => {
		const user = userEvent.setup();
		const onSaved = vi.fn();
		renderWithTheme(
			<UnitsDialog
				user={student}
				groups={groups}
				error={null}
				onClose={vi.fn()}
				onSaved={onSaved}
			/>
		);

		expect(
			screen.getByRole("checkbox", { name: "الوحدة 1 — 100 ₪" })
		).toBeChecked();
		expect(screen.getByText("1 وحدة · 100 ₪")).toBeInTheDocument();
		await user.click(screen.getByRole("checkbox", { name: "الوحدة 2 — 80 ₪" }));
		expect(screen.getByText("2 وحدات · 180 ₪")).toBeInTheDocument();
		await user.click(screen.getByRole("button", { name: "حفظ" }));

		expect(axios.put).toHaveBeenCalledWith("/api/user/u1/units", {
			unitIds: ["unit-1", "unit-2"],
		});
		expect(onSaved).toHaveBeenCalled();
	});
});

describe("parseUnitPrice (new unit form)", () => {
	it("empty is free, whole numbers are prices, the rest is invalid", () => {
		expect(parseUnitPrice("")).toBeNull();
		expect(parseUnitPrice(" 120 ")).toBe(120);
		for (const bad of ["0", "-5", "1.5", "abc", "100001"]) {
			expect(parseUnitPrice(bad)).toBe("invalid");
		}
	});
});

describe("subscribeLink (WhatsApp)", () => {
	const unit = { id: "u", name: "الوحدة الأولى", price: 100 };
	const text = (className: string) =>
		decodeURIComponent(
			subscribeLink("970599000000", unit, className).split("?text=")[1]
		);

	it("names the unit, the class (with صف once) and the price, politely", () => {
		expect(text("العاشر")).toContain("«الوحدة الأولى» من الصف العاشر (100 ₪)");
		expect(text("الصف العاشر")).toContain("من الصف العاشر (");
		expect(text("العاشر")).toMatch(/^السلام عليكم/);
	});
});
