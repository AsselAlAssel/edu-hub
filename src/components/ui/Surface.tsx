"use client";
import { Box, type BoxProps } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { forwardRef, type PointerEvent } from "react";

export type SurfaceProps = BoxProps & {
	/**
	 * `default` = card, `secondary` = inset/tinted, `elevated` = raised card,
	 * `glass` = translucent panel over decorative backgrounds.
	 */
	variant?: "default" | "secondary" | "elevated" | "glass";
	/** Hover lift + pointer-following border glow for clickable cards. */
	interactive?: boolean;
	padding?: number | Record<string, number>;
};

// Writes pointer coords as CSS vars; the glow itself is pure CSS (no re-render).
const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
	const node = event.currentTarget;
	const rect = node.getBoundingClientRect();
	node.style.setProperty("--qa-mx", `${event.clientX - rect.left}px`);
	node.style.setProperty("--qa-my", `${event.clientY - rect.top}px`);
};

/** Token-driven container: the base of every card on the platform. */
const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface(
	{
		variant = "default",
		interactive = false,
		padding = 0,
		sx,
		onPointerMove,
		...props
	},
	ref
) {
	return (
		<Box
			ref={ref}
			onPointerMove={(event: PointerEvent<HTMLDivElement>) => {
				if (interactive) trackPointer(event);
				onPointerMove?.(event);
			}}
			sx={[
				(theme) => {
					const { colors, shadows, radii } = theme.tokens;
					const isDark = theme.palette.mode === "dark";
					const background = {
						default: colors.surface,
						secondary: colors.surfaceSecondary,
						elevated: colors.surfaceElevated,
						glass: alpha(colors.surface, isDark ? 0.72 : 0.82),
					}[variant];
					return {
						position: "relative",
						borderRadius: `${radii.lg}px`,
						border: `1px solid ${colors.border}`,
						p: padding,
						backgroundColor: background,
						// Faint top light in dark mode gives cards a lit edge.
						backgroundImage: isDark
							? `linear-gradient(160deg, ${alpha(colors.textPrimary, 0.045)} 0%, transparent 40%)`
							: `linear-gradient(160deg, #FFFFFF 0%, ${alpha("#FFFFFF", 0)} 45%)`,
						boxShadow:
							variant === "elevated" || variant === "glass"
								? shadows.medium
								: shadows.subtle,
						...(variant === "glass" && {
							backdropFilter: "blur(14px)",
							WebkitBackdropFilter: "blur(14px)",
						}),
						transition: theme.transitions.create(
							["border-color", "box-shadow", "transform", "background-color"],
							{ duration: theme.transitions.duration.standard }
						),
						...(interactive && {
							"&::after": {
								content: '""',
								position: "absolute",
								inset: -1,
								borderRadius: "inherit",
								padding: "1px",
								pointerEvents: "none",
								background: `radial-gradient(360px circle at var(--qa-mx, 50%) var(--qa-my, 0%), ${alpha(colors.cyan, isDark ? 0.75 : 0.6)}, transparent 55%)`,
								WebkitMask:
									"linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
								WebkitMaskComposite: "xor",
								mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
								opacity: 0,
								transition: "opacity 280ms ease",
							},
							"&:hover, &:focus-within": {
								borderColor: colors.borderStrong,
								boxShadow: isDark
									? `${shadows.medium}, 0 0 32px ${alpha(colors.cyan, 0.12)}`
									: shadows.medium,
								"&::after": { opacity: 1 },
							},
							"@media (hover: hover) and (prefers-reduced-motion: no-preference)":
								{
									"&:hover": { transform: "translateY(-4px)" },
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
