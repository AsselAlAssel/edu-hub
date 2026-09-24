"use client";
import SortableGrid from "@/components/SortableGrid";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import { Box } from "@mui/material";
import type { Folder } from "@prisma/client";
import AddResourceCard from "./AddResourceCard";
import FolderCard from "./FolderCard";
import ResourceSection from "./ResourceSection";

export const folderGridSx = {
	display: "grid",
	gap: 1.5,
	gridTemplateColumns: {
		xs: "1fr",
		sm: "repeat(2, minmax(0, 1fr))",
		md: "repeat(3, minmax(0, 1fr))",
		lg: "repeat(4, minmax(0, 1fr))",
	},
} as const;

export default function FolderSection({
	folders,
	isAdmin,
	isDraggingItem,
	overFolderId,
	onCreate,
	onRename,
	onDelete,
}: {
	folders: Folder[];
	isAdmin: boolean;
	isDraggingItem: boolean;
	overFolderId: string | null;
	onCreate: () => void;
	onRename: (folder: Folder) => void;
	onDelete: (folder: Folder) => void;
}) {
	if (!folders.length && !isAdmin) return null;

	return (
		<ResourceSection
			id='folders-title'
			title='المجلدات'
			count={folders.length}
			icon={<FolderOutlinedIcon />}
		>
			<SortableGrid
				items={folders}
				isAdmin={isAdmin}
				gridSx={folderGridSx}
				label='المجلدات'
				getHandleLabel={(folder) => `إعادة ترتيب المجلد: ${folder.name}`}
				renderItem={(folder, handle) => (
					<FolderCard
						folder={folder}
						handle={handle}
						isAdmin={isAdmin}
						dropState={
							!isDraggingItem
								? "idle"
								: overFolderId === folder.id
									? "over"
									: "available"
						}
						onEdit={() => onRename(folder)}
						onDelete={() => onDelete(folder)}
					/>
				)}
				extraItems={
					isAdmin ? (
						<Box component='li'>
							<AddResourceCard compact label='مجلد جديد' onClick={onCreate} />
						</Box>
					) : null
				}
			/>
		</ResourceSection>
	);
}
