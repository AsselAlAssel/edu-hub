"use client";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type Tone = "primary" | "secondary" | "success" | "warning" | "error" | "info";

/**
 * Consistent icon container used by feature cards, empty states, etc.
 * Parents can animate it on hover via the `.qa-icon-tile` class.
 */
export default function IconTile({
	children,
	tone = "primary",
	size = 48,
}: {
	children: ReactNode;
	tone?: Tone;
	size?: number;
}) {
	return (
		<Box
			aria-hidden
			className='qa-icon-tile'
			sx={(theme) => {
				const color = theme.palette[tone].main;
				const isDark = theme.palette.mode === "dark";
				return {
					width: size,
					height: size,
					flexShrink: 0,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					color,
					background: `linear-gradient(145deg, ${alpha(color, isDark ? 0.26 : 0.16)}, ${alpha(color, isDark ? 0.06 : 0.04)})`,
					border: `1px solid ${alpha(color, isDark ? 0.4 : 0.3)}`,
					boxShadow: isDark ? `0 0 24px ${alpha(color, 0.18)}` : "none",
					transition: theme.transitions.create(["transform", "box-shadow"]),
					"& svg": {
						fontSize: Math.round(size * 0.5),
						transition: theme.transitions.create("transform"),
					},
				};
			}}
		>
			{children}
		</Box>
	);
}
