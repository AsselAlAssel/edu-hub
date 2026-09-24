"use client";
import { Box, type BoxProps } from "@mui/material";
import { layout } from "../../../theme/tokens";

/** Centered content column with the standard responsive gutters. */
export default function PageContainer({ sx, ...props }: BoxProps) {
	return (
		<Box
			sx={[
				{
					width: "100%",
					maxWidth: layout.contentMaxWidth,
					mx: "auto",
					px: { xs: 2, sm: 3, lg: 4 },
				},
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
			{...props}
		/>
	);
}
