"use client";
import { Box, type BoxProps } from "@mui/material";
import { forwardRef } from "react";

export type SurfaceProps = BoxProps & {
	/** `default` = card, `secondary` = inset/tinted, `elevated` = raised card. */
	variant?: "default" | "secondary" | "elevated";
	/** Adds hover/focus-within affordances for clickable cards. */
	interactive?: boolean;
	padding?: number | Record<string, number>;
};

/** Token-driven container: the base of every card on the platform. */
const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
	{ variant = "default", interactive = false, padding = 0, sx, ...props },
	ref
) {
	return (
		<Box
			ref={ref}
			sx={[
				(theme) => {
					const { colors, shadows, radii } = theme.tokens;
					return {
						position: "relative",
						borderRadius: `${radii.lg}px`,
						border: `1px solid ${colors.border}`,
						p: padding,
						backgroundColor:
							variant === "secondary"
								? colors.surfaceSecondary
								: variant === "elevated"
									? colors.surfaceElevated
									: colors.surface,
						boxShadow: variant === "elevated" ? shadows.medium : shadows.subtle,
						transition: theme.transitions.create(
							["border-color", "box-shadow", "transform", "background-color"],
							{ duration: theme.transitions.duration.short }
						),
						...(interactive && {
							"&:hover": {
								borderColor: colors.borderStrong,
								boxShadow: shadows.medium,
							},
							"&:focus-within": { borderColor: colors.borderStrong },
							"@media (prefers-reduced-motion: no-preference)": {
								"&:hover": { transform: "translateY(-2px)" },
							},
						}),
					};
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
			{...props}
		/>
	);
});

export default Surface;
