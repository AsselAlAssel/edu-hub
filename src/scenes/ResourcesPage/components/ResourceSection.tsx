"use client";
import { Box, Chip, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

/** Section heading with a real item count, followed by its grid. */
export default function ResourceSection({
	id,
	title,
	count,
	icon,
	children,
}: {
	id: string;
	title: string;
	count: number;
	icon: ReactNode;
	children: ReactNode;
}) {
	return (
		<Box component='section' aria-labelledby={id}>
			<Stack direction='row' alignItems='center' gap={1.25} sx={{ mb: 2 }}>
				<Box aria-hidden sx={{ color: "primary.main", display: "flex" }}>
					{icon}
				</Box>
				<Typography
					variant='h4'
					component='h2'
					id={id}
					sx={{ fontSize: "1.25rem" }}
				>
					{title}
				</Typography>
				<Chip
					size='small'
					label={count}
					aria-label={`${count} عنصر`}
					variant='outlined'
				/>
			</Stack>
			{children}
		</Box>
	);
}
