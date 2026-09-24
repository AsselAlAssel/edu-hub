"use client";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { ButtonBase, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

/** Dashed "add" tile at the end of each admin section. */
export default function AddResourceCard({
	label,
	onClick,
	compact = false,
}: {
	label: string;
	onClick: () => void;
	compact?: boolean;
}) {
	return (
		<ButtonBase
			onClick={onClick}
			sx={(theme) => ({
				width: "100%",
				height: "100%",
				minHeight: compact ? 72 : 180,
				borderRadius: `${theme.tokens.radii.lg}px`,
				border: `1.5px dashed ${theme.tokens.colors.borderStrong}`,
				color: "primary.main",
				backgroundColor: alpha(theme.tokens.colors.cyan, 0.03),
				transition: theme.transitions.create([
					"background-color",
					"border-color",
					"box-shadow",
				]),
				"& svg": { transition: theme.transitions.create("transform") },
				"&:hover, &.Mui-focusVisible": {
					borderColor: theme.palette.primary.main,
					backgroundColor: alpha(theme.tokens.colors.cyan, 0.08),
					boxShadow: `inset 0 0 30px ${alpha(theme.tokens.colors.cyan, 0.08)}`,
				},
				"&:hover svg": { transform: "rotate(90deg) scale(1.15)" },
				"&.Mui-focusVisible": {
					outline: `2px solid ${theme.palette.primary.main}`,
					outlineOffset: 2,
				},
			})}
		>
			<Stack direction={compact ? "row" : "column"} alignItems='center' gap={1}>
				<AddRoundedIcon />
				<Typography component='span' sx={{ fontWeight: 600, color: "inherit" }}>
					{label}
				</Typography>
			</Stack>
		</ButtonBase>
	);
}
