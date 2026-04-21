"use client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import React, { useMemo } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import MuiThemeSync from "./MuiThemeSync";

/** Persisted key for `next-themes` (localStorage). */
export const THEME_STORAGE_KEY = "edu-hub-theme";

// Emotion cache + RTL: https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
export default function ThemeRegistry(props: {
	direction: "ltr" | "rtl";
	children: React.ReactNode;
}) {
	const { direction, children } = props;
	const isRtl = useMemo(() => direction === "rtl", [direction]);
	const cache = useMemo(() => {
		const key = `mui-${isRtl ? "rtl" : "ltr"}`;
		const plugins = isRtl ? [prefixer, rtlPlugin] : [];
		return createCache({
			key,
			stylisPlugins: plugins,
		});
	}, [isRtl]);

	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='light'
			enableSystem={false}
			storageKey={THEME_STORAGE_KEY}
			disableTransitionOnChange={false}
		>
			<CacheProvider value={cache}>
				<MuiThemeSync direction={direction}>{children}</MuiThemeSync>
			</CacheProvider>
		</NextThemesProvider>
	);
}
