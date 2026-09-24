"use client";
import { Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { ReactNode } from "react";

type Tone = "primary" | "secondary" | "success" | "warning" | "error" | "info";

/** Consistent square icon container used by feature cards, empty states, etc. */
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
			sx={(theme) => {
				const color = theme.palette[tone].main;
				return {
					width: size,
					height: size,
					flexShrink: 0,
					display: "grid",
					placeItems: "center",
					borderRadius: `${theme.tokens.radii.md}px`,
					color,
					backgroundColor: alpha(
						color,
						theme.palette.mode === "dark" ? 0.14 : 0.1
					),
					border: `1px solid ${alpha(color, 0.24)}`,
					"& svg": { fontSize: Math.round(size * 0.5) },
				};
			}}
		>
			{children}
		</Box>
	);
}
