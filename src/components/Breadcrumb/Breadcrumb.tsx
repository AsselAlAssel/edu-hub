"use client";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { alpha, Box, Breadcrumbs, Typography } from "@mui/material";
import Link from "next/link";

export default function Breadcrumb({
	breadcrumb,
	classId,
	folderId,
}: {
	breadcrumb: {
		id: string;
		name: string;
	}[];
	classId: string;
	folderId: string;
}) {
	if (!breadcrumb) return null;
	if (breadcrumb.length === 1) return null;

	return (
		<Breadcrumbs
			aria-label='breadcrumb'
			sx={{
				mb: 2,
				"& .MuiBreadcrumbs-separator": {
					color: "text.disabled",
				},
			}}
			maxItems={2}
		>
			<Box
				component={Link}
				href={`/class/${classId}/folder/${breadcrumb[0].id}`}
				sx={{
					cursor: "pointer",
					textDecoration: "none",
					color: "text.secondary",
					display: "flex",
					alignItems: "center",
					"&:hover": { color: "primary.main" },
				}}
			>
				<HomeOutlinedIcon sx={{ fontSize: 20 }} />
			</Box>

			{breadcrumb.slice(1).map((item) => {
				const isActive = item.id === folderId;
				return (
					<Box
						key={item.id}
						component={Link}
						href={`/class/${classId}/folder/${item.id}`}
						sx={{
							cursor: "pointer",
							textDecoration: "none",
							color: isActive ? "text.primary" : "text.secondary",
							"&:hover": { color: "primary.main" },
						}}
					>
						<Typography
							sx={(theme) => ({
								fontSize: "0.875rem",
								fontWeight: isActive ? 600 : 400,
								backgroundColor: isActive
									? alpha(theme.palette.primary.main, 0.1)
									: "transparent",
								px: 1.5,
								py: 0.5,
								borderRadius: "6px",
								transition: "background-color 0.15s ease, color 0.15s ease",
								"&:hover": {
									backgroundColor: alpha(theme.palette.primary.main, 0.08),
								},
							})}
						>
							{item.name}
						</Typography>
					</Box>
				);
			})}
		</Breadcrumbs>
	);
}
