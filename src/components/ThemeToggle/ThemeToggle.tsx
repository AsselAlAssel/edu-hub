"use client";

import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { IconAction } from "@/components/ui/buttons";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";

/** Switches between light and dark mode (persisted by next-themes). */
export default function ThemeToggle() {
	// Same source as every other colour on the page (MuiThemeSync follows the
	// <html> class), so icon, label and colours can never disagree.
	const isDark = useTheme().palette.mode === "dark";
	const { setTheme } = useNextTheme();
	const label = isDark
		? "التبديل إلى الوضع الفاتح"
		: "التبديل إلى الوضع الداكن";

	return (
		<IconAction
			label={label}
			onClick={() => setTheme(isDark ? "light" : "dark")}
			data-testid='theme-toggle'
			sx={(theme) => ({
				width: 42,
				height: 42,
				overflow: "hidden",
				color: isDark ? theme.tokens.colors.amber : theme.tokens.colors.violet,
				border: `1px solid ${theme.tokens.colors.border}`,
				"&:hover": {
					borderColor: theme.tokens.colors.borderStrong,
					backgroundColor: theme.palette.action.hover,
				},
			})}
		>
			{/* Icon swap: the outgoing icon spins away as the new one rises in. */}
			<AnimatePresence mode='wait' initial={false}>
				<motion.span
					key={isDark ? "sun" : "moon"}
					initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
					animate={{ opacity: 1, rotate: 0, scale: 1 }}
					exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
					transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
					style={{ display: "grid", placeItems: "center" }}
				>
					{isDark ? (
						<LightModeOutlinedIcon fontSize='small' />
					) : (
						<DarkModeOutlinedIcon fontSize='small' />
					)}
				</motion.span>
			</AnimatePresence>
		</IconAction>
	);
}
