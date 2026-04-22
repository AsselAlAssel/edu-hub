"use client";

import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { IconButton } from "@mui/material";
import { useTheme as useNextTheme } from "next-themes";
import { useCallback, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** زر واحد يبدّل مباشرة بين الوضع الفاتح والداكن (بدون قائمة). */
export default function ThemeToggle() {
	const mounted = useSyncExternalStore(
		emptySubscribe,
		getClientSnapshot,
		getServerSnapshot
	);
	const { resolvedTheme, setTheme } = useNextTheme();
	const isDark = mounted && resolvedTheme === "dark";

	const toggle = useCallback(() => {
		setTheme(isDark ? "light" : "dark");
	}, [isDark, setTheme]);

	return (
		<IconButton
			size='small'
			onClick={toggle}
			title={isDark ? "وضع فاتح" : "وضع داكن"}
			aria-label={
				isDark ? "التبديل إلى الوضع الفاتح" : "التبديل إلى الوضع الداكن"
			}
			sx={(t) => ({
				color: "text.tertiary",
				border: "1px solid",
				borderColor: "divider",
				borderRadius: 2,
				transition: t.transitions.create(
					["background-color", "border-color", "color", "transform"],
					{ duration: t.transitions.duration.shorter }
				),
				"&:hover": {
					backgroundColor: "action.hover",
					borderColor: "primary.main",
					color: "primary.main",
				},
				"&:active": {
					transform: "scale(0.94)",
				},
			})}
		>
			{isDark ? (
				<LightModeRoundedIcon sx={{ fontSize: 22 }} />
			) : (
				<DarkModeRoundedIcon sx={{ fontSize: 22 }} />
			)}
		</IconButton>
	);
}
