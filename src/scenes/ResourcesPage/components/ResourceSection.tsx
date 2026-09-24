"use client";
import { Reveal } from "@/components/ui/motion";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
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
			<Reveal y={12}>
				<Stack direction='row' alignItems='center' gap={1.5} sx={{ mb: 2.5 }}>
					<Box
						aria-hidden
						sx={(theme) => ({
							display: "grid",
							placeItems: "center",
							width: 36,
							height: 36,
							borderRadius: `${theme.tokens.radii.sm}px`,
							color:
								theme.palette.mode === "dark"
									? "primary.light"
									: "primary.main",
							backgroundColor: alpha(theme.tokens.colors.cyan, 0.12),
							border: `1px solid ${alpha(theme.tokens.colors.cyan, 0.3)}`,
							"& svg": { fontSize: 20 },
						})}
					>
						{icon}
					</Box>
					<Typography
						variant='h4'
						component='h2'
						id={id}
						sx={{
							fontSize: { xs: "1.25rem", md: "1.4375rem" },
							fontWeight: 700,
						}}
					>
						{title}
					</Typography>
					<Box
						component='span'
						className='qa-latin'
						sx={(theme) => ({
							minWidth: 28,
							px: 1,
							py: 0.125,
							borderRadius: `${theme.tokens.radii.full}px`,
							textAlign: "center",
							fontSize: "0.8125rem",
							fontWeight: 700,
							color:
								theme.palette.mode === "dark" ? theme.tokens.colors.bg : "#fff",
							backgroundImage: theme.tokens.gradients.primary,
						})}
					>
						{count}
						<span className='qa-visually-hidden'> عنصر</span>
					</Box>
					{/* Rule that fills the rest of the row. */}
					<Box
						aria-hidden
						sx={(theme) => ({
							flex: 1,
							height: 1,
							background: `linear-gradient(to left, ${theme.tokens.colors.border}, transparent)`,
						})}
					/>
				</Stack>
			</Reveal>
			{children}
		</Box>
	);
}
