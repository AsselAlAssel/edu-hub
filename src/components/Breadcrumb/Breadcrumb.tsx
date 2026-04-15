import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs, Typography } from "@mui/material";
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
					color: "#98A2B3",
				},
			}}
			maxItems={2}
		>
			<Link
				href={`/class/${classId}/folder/${breadcrumb[0].id}`}
				style={{
					cursor: "pointer",
					textDecoration: "none",
					color: "#667085",
					display: "flex",
					alignItems: "center",
				}}
			>
				<HomeOutlinedIcon sx={{ fontSize: 20 }} />
			</Link>

			{breadcrumb.slice(1).map((item) => {
				const isActive = item.id === folderId;
				return (
					<Link
						key={item.id}
						href={`/class/${classId}/folder/${item.id}`}
						style={{
							cursor: "pointer",
							textDecoration: "none",
							color: isActive ? "#101828" : "#667085",
						}}
					>
						<Typography
							sx={{
								fontSize: "0.875rem",
								fontWeight: isActive ? 600 : 400,
								backgroundColor: isActive ? "#F2F4F7" : "transparent",
								px: 1.5,
								py: 0.5,
								borderRadius: "6px",
								transition: "all 0.15s ease",
								"&:hover": {
									backgroundColor: "#F2F4F7",
								},
							}}
						>
							{item.name}
						</Typography>
					</Link>
				);
			})}
		</Breadcrumbs>
	);
}
