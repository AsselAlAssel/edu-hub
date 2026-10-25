import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import type { PublicUser } from "@/libs/users";
import UnitsDialog from "@/scenes/ProfilerPage/components/UnitsDialog";
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

		expect(screen.getByLabelText("الوحدة 1 — 100 ₪")).toBeChecked();
		await user.click(screen.getByLabelText("الوحدة 2 — 80 ₪"));
		await user.click(screen.getByRole("button", { name: "حفظ" }));

		expect(axios.put).toHaveBeenCalledWith("/api/user/u1/units", {
			unitIds: ["unit-1", "unit-2"],
		});
		expect(onSaved).toHaveBeenCalled();
	});
});
