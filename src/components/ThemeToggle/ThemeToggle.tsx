"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { IconAction } from "@/components/ui/buttons";
import { useTheme as useNextTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/** Switches between light and dark mode (persisted by next-themes). */
export default function ThemeToggle() {
	// next-themes only knows the stored theme after mount; the default is dark.
	const mounted = useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false
	);
	const { resolvedTheme, setTheme } = useNextTheme();
	const isDark = !mounted || resolvedTheme !== "light";
	const label = isDark
		? "التبديل إلى الوضع الفاتح"
		: "التبديل إلى الوضع الداكن";

	return (
		<IconAction
			label={label}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			data-testid='theme-toggle'
			sx={(theme) => ({
				width: 40,
				height: 40,
				color: "text.secondary",
				border: `1px solid ${theme.tokens.colors.border}`,
				"&:hover": {
					color: "primary.main",
					borderColor: theme.tokens.colors.borderStrong,
				},
			})}
		>
			{isDark ? (
				<LightModeOutlinedIcon fontSize='small' />
			) : (
				<DarkModeOutlinedIcon fontSize='small' />
			)}
		</IconAction>
	);
}
