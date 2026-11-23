import { ThemeProvider } from "@mui/material/styles";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Header from "@/components/Common/Dashboard/Header";
import { createEduTheme } from "../../theme";
import { asGuest, navigationState } from "../utils";

// Tag skeleton only: attribute/style differences are patched silently, but a
// missing or extra element makes React throw #418 and re-render the page.
const skeleton = (pathname: string) => {
	navigationState.pathname = pathname;
	const html = renderToString(
		<ThemeProvider theme={createEduTheme("rtl", "light")}>
			<Header />
		</ThemeProvider>
	);
	return html.replace(/<(\/?[a-z]+)[^>]*>/g, "<$1>").replace(/>[^<]+</g, "><");
};

describe("header hydration", () => {
	it("renders the same elements whether or not the server sees pathname '/'", () => {
		asGuest();
		// The prerendered "/" page does not get "/" from usePathname (proxy.ts),
		// while the browser does: both must produce the same element tree.
		expect(skeleton("/")).toBe(skeleton("/index"));
	});
});
