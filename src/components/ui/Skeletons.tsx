"use client";
import { Box, Skeleton, Stack } from "@mui/material";
import Surface from "./Surface";

export const cardGridSx = {
	display: "grid",
	gap: { xs: 2, md: 2.5 },
	gridTemplateColumns: {
		xs: "1fr",
		sm: "repeat(2, minmax(0, 1fr))",
		md: "repeat(3, minmax(0, 1fr))",
		lg: "repeat(4, minmax(0, 1fr))",
	},
} as const;

/** Placeholder grid of media cards (classes, videos). */
export function CardGridSkeleton({ count = 8 }: { count?: number }) {
	return (
		<Box sx={cardGridSx} aria-hidden>
			{Array.from({ length: count }, (_, index) => (
				<Surface key={index} sx={{ overflow: "hidden" }}>
					<Skeleton
						variant='rectangular'
						sx={{ aspectRatio: "16 / 9", height: "auto" }}
					/>
					<Stack spacing={1} sx={{ p: 2 }}>
						<Skeleton variant='text' width='70%' height={28} />
						<Skeleton variant='text' width='40%' />
					</Stack>
				</Surface>
			))}
		</Box>
	);
}

/** Placeholder for the resource explorer (folder row + card grid). */
export function ResourcesSkeleton() {
	return (
		<Stack spacing={5} aria-hidden>
			<Box sx={cardGridSx}>
				{Array.from({ length: 4 }, (_, index) => (
					<Skeleton key={index} variant='rounded' height={64} />
				))}
			</Box>
			<CardGridSkeleton count={4} />
		</Stack>
	);
}
