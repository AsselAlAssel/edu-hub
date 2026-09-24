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
		let inserted: { name: string; isGlobal: boolean }[] = [];
		cache.insert = (...args) => {
			const [selector, serialized] = args;
			if (cache.inserted[serialized.name] === undefined) {
				// Global styles (CssBaseline, GlobalStyles) are inserted without a selector.
				inserted.push({ name: serialized.name, isGlobal: !selector });
			}
			return prevInsert(...args);
		};
		const flush = () => {
			const entries = inserted;
			inserted = [];
			return entries;
		};
		return { cache, flush };
	});

	useServerInsertedHTML(() => {
		const entries = registry.flush();
		if (entries.length === 0) return null;
		const { key, inserted } = registry.cache;
		const css = (name: string) => {
			const style = inserted[name];
			return typeof style === "string" ? style : "";
		};
		const globals = entries.filter((entry) => entry.isGlobal);
		const scoped = entries.filter((entry) => !entry.isGlobal);
		return (
			<>
				{/* Globals get their own "<key>-global" tags so emotion can remove the
				    server copies on the client — otherwise the SSR (dark) body rules
				    outlive a theme switch. */}
				{globals.map(({ name }) => (
					<style
						key={name}
						data-emotion={`${key}-global ${name}`}
						dangerouslySetInnerHTML={{ __html: css(name) }}
					/>
				))}
				{scoped.length ? (
					<style
						key={key}
						data-emotion={`${key} ${scoped.map((entry) => entry.name).join(" ")}`}
						dangerouslySetInnerHTML={{
							__html: scoped.map((entry) => css(entry.name)).join(""),
						}}
					/>
				) : null}
			</>
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
