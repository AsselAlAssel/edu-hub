import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithTheme } from "../utils";
import WhatsNewDialog from "@/components/WhatsNew/WhatsNewDialog";

const { closeWhatsNew } = vi.hoisted(() => ({ closeWhatsNew: vi.fn() }));

vi.mock("@/components/WhatsNew/useWhatsNew", () => ({
	default: () => ({ open: true, close: closeWhatsNew }),
}));

describe("what's new dialog", () => {
	it("requires visitors to read every announcement before they can dismiss it", async () => {
		const user = userEvent.setup();
		renderWithTheme(<WhatsNewDialog whatsAppNumber='972597408236' />);

		expect(
			screen.getByRole("heading", { name: "3 وحدات مدفوعة في المنصة" })
		).toBeVisible();
		expect(screen.getByRole("button", { name: "إغلاق" })).toBeDisabled();
		expect(screen.queryByRole("button", { name: "تخطّي" })).toBeNull();

		for (const title of ["توزيع الوحدات حسب التوجيهي", "للاشتراك بالوحدات"]) {
			await user.click(screen.getByRole("button", { name: "التالي" }));
			expect(
				screen.getByRole("group", { name: new RegExp(title) })
			).toBeInTheDocument();
			if (title === "توزيع الوحدات حسب التوجيهي") {
				expect(
					screen.getByText(
						/يمكنك الاشتراك في أي وحدة؛ فهي لنفس المسار، والاختلاف في التسمية فقط/
					)
				).toBeInTheDocument();
			}
		}

		expect(screen.getByRole("button", { name: "إغلاق" })).toBeEnabled();
		expect(screen.getByRole("button", { name: "تخطّي" })).toBeVisible();
		expect(
			screen.getByRole("link", { name: "راسلنا على واتساب" })
		).toHaveAttribute("href", "https://wa.me/972597408236");
	});
});
