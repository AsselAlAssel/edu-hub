// @vitest-environment node
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { renderToString } from "react-dom/server";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { describe, expect, it } from "vitest";
import { FormField, PasswordField } from "@/components/ui/FormField";
import { createEduTheme } from "../../theme";

/**
 * Regression: a stylis version mismatch (prefixer 4.3 inside emotion's 4.2
 * compiler) crashed SSR of any MUI input ("reading 'push'" on ::placeholder),
 * taking down /auth/signin. Mirrors ThemeRegistry's cache setup.
 */
describe("RTL emotion SSR", () => {
	it("server-renders MUI inputs with the RTL + prefixer plugins", () => {
		const cache = createCache({
			key: "mui-rtl",
			stylisPlugins: [prefixer, rtlPlugin],
		});
		const html = renderToString(
			<CacheProvider value={cache}>
				<ThemeProvider theme={createEduTheme("rtl", "light")}>
					<FormField label='البريد الإلكتروني' placeholder='name@example.com' />
					<PasswordField label='كلمة المرور' />
				</ThemeProvider>
			</CacheProvider>
		);
		expect(html).toContain("البريد الإلكتروني");
		// Styles were serialised through the RTL pipeline without throwing.
		expect(html).toMatch(/<style[^>]*data-emotion="mui-rtl/);
	});
});
