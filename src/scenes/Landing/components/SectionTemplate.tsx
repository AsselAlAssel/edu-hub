import { SxProps, Theme } from "@mui/material";
import React from "react";
import { StyledBoxSection } from "./Styled";

export default function SectionTemplate({
	children,
	sx,
	id,
}: {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
	id?: string;
}) {
	return (
		<StyledBoxSection sx={sx} id={id}>
			{children}
		</StyledBoxSection>
	);
}
