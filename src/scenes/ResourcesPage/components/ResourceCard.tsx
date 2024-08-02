import FolderIcon from "@mui/icons-material/Folder";
import { Stack, Typography } from "@mui/material";
import { Resource } from "@prisma/client";

export default function ResourceCard({ resource }: { resource: Resource }) {
	const WarperComponent = resource.url !== "#" ? "a" : "div";

	return (
		<WarperComponent
			href={resource.url ?? "#"}
			download={true}
			style={{ width: "100%" }}
		>
			<Stack
				direction='row'
				alignItems='center'
				sx={{
					border: "1px solid #E0E0E0",
					borderRadius: 1,
					padding: 1.5,
					cursor: "pointer",
					width: "100%",
					backgroundColor: "#F0F4F9",
				}}
				gap={1}
			>
				<Typography variant='h6'>{resource.title}</Typography>
				<Stack justifyContent={"center"} alignItems={"center"} p={1}>
					<FolderIcon />
				</Stack>
			</Stack>
		</WarperComponent>
	);
}
