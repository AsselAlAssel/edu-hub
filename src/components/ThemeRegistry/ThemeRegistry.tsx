"use client";
import createCache from "@emotion/cache";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import React, { useMemo } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { createEduTheme } from "../../../theme";

// This implementation is from emotion-js
// https://github.com/emotion-js/emotion/issues/2928#issuecomment-1319747902
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
		<CacheProvider value={cache}>
			<ThemeProvider theme={createEduTheme(direction)}>
				{children}
			</ThemeProvider>
		</CacheProvider>
	);
}
