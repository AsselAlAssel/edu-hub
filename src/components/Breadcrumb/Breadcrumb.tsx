import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { Breadcrumbs } from "@mui/material";
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
			}}
			maxItems={2}
		>
			<Link
				href={`/class/${classId}/folder/${breadcrumb[0].id}`}
				style={{
					cursor: "pointer",
					textDecoration: "none",
					color: "black",
				}}
			>
				<HomeOutlinedIcon />
			</Link>

			{breadcrumb.slice(1).map((item) => {
				return (
					<span key={item.id}>
						<Link
							href={`/class/${classId}/folder/${item.id}`}
							style={{
								cursor: "pointer",
								textDecoration: "none",
								color: "black",
								backgroundColor: item.id === folderId ? "#f0f0f0" : "white",
								padding: "5px",
								borderRadius: "5px",
								fontWeight: item.id === folderId ? "bold" : "normal",
							}}
						>
							{item.name}
						</Link>
					</span>
				);
			})}
		</Breadcrumbs>
	);
}
