import VideoPlayer from "@/components/VideoPlayer";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithTheme } from "../utils";

const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

describe("video player and the back button", () => {
	beforeEach(() => window.history.replaceState({ page: 1 }, ""));

	it("back closes the player without leaving the page", async () => {
		const handleClose = vi.fn();
		renderWithTheme(<VideoPlayer open url={url} handleClose={handleClose} />);
		expect(window.history.state).toMatchObject({
			page: 1,
			__videoPlayer: true,
		});

		window.history.back();

		await vi.waitFor(() => expect(handleClose).toHaveBeenCalledTimes(1));
		expect(window.history.state).toEqual({ page: 1 });
	});

	it("the close button also pops the entry it pushed", async () => {
		const handleClose = vi.fn();
		renderWithTheme(<VideoPlayer open url={url} handleClose={handleClose} />);

		await userEvent.click(screen.getByRole("button", { name: "إغلاق" }));

		await vi.waitFor(() => expect(handleClose).toHaveBeenCalledTimes(1));
		expect(window.history.state).toEqual({ page: 1 });
	});
});
