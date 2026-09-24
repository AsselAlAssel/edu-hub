"use client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useServerInsertedHTML } from "next/navigation";
import React, { useState } from "react";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import MuiThemeSync from "./MuiThemeSync";

/** Persisted key for `next-themes` (localStorage). */
export const THEME_STORAGE_KEY = "edu-hub-theme";

/**
 * Emotion cache that records inserted rule names during SSR and flushes them
 * into the document head (MUI's App Router recipe), with the RTL stylis plugin.
 */
function useEmotionCache(direction: "ltr" | "rtl") {
	const [registry] = useState(() => {
		const cache = createCache({
			key: direction === "rtl" ? "mui-rtl" : "mui",
			stylisPlugins: direction === "rtl" ? [prefixer, rtlPlugin] : [],
		});
		cache.compat = true;
		const prevInsert = cache.insert;
		let inserted: string[] = [];
		cache.insert = (...args) => {
			const serialized = args[1];
			if (cache.inserted[serialized.name] === undefined) {
				inserted.push(serialized.name);
			}
			return prevInsert(...args);
		};
		const flush = () => {
			const names = inserted;
			inserted = [];
			return names;
		};
		return { cache, flush };
	});

	useServerInsertedHTML(() => {
		const names = registry.flush();
		if (names.length === 0) return null;
		const styles = names
			.map((name) => registry.cache.inserted[name])
			.filter((style): style is string => typeof style === "string")
			.join("");
		return (
			<style
				key={registry.cache.key}
				data-emotion={`${registry.cache.key} ${names.join(" ")}`}
				dangerouslySetInnerHTML={{ __html: styles }}
			/>
		);
	});

	return registry.cache;
}

export default function ThemeRegistry({
	direction,
	children,
}: {
	direction: "ltr" | "rtl";
	children: React.ReactNode;
}) {
	const cache = useEmotionCache(direction);

	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='dark'
			enableSystem={false}
			storageKey={THEME_STORAGE_KEY}
			disableTransitionOnChange
		>
			<CacheProvider value={cache}>
				<MuiThemeSync direction={direction}>{children}</MuiThemeSync>
			</CacheProvider>
		</NextThemesProvider>
	);
}
