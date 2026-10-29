import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import IconTile from "./IconTile";
import Surface from "./Surface";

/** A big number with its label and a toned icon (dashboard summaries). */
export default function StatTile({
	icon,
	label,
	value,
	tone,
}: {
	icon: ReactNode;
	label: string;
	value: number;
	tone: "primary" | "secondary" | "success" | "info" | "warning";
}) {
	return (
		<Surface sx={{ p: 2, display: "flex", alignItems: "center", gap: 1.5 }}>
			<IconTile tone={tone} size={44}>
				{icon}
			</IconTile>
			<Box sx={{ minWidth: 0 }}>
				<Typography variant='h5' sx={{ fontWeight: 800, lineHeight: 1.1 }}>
					{value.toLocaleString("ar")}
				</Typography>
				<Typography variant='body2' sx={{ color: "text.secondary" }} noWrap>
					{label}
				</Typography>
			</Box>
		</Surface>
	);
}
