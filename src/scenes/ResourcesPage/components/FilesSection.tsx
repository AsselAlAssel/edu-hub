"use client";
import SortableGrid from "@/components/SortableGrid";
import { cardGridSx } from "@/components/ui/Skeletons";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Box } from "@mui/material";
import type { File } from "@prisma/client";
import AddResourceCard from "./AddResourceCard";
import FileCard from "./FileCard";
import ResourceSection from "./ResourceSection";

export default function FilesSection({
	files,
	isAdmin,
	onAdd,
	onRename,
	onDelete,
	onMove,
}: {
	files: File[];
	isAdmin: boolean;
	onAdd: () => void;
	onRename: (file: File) => void;
	onDelete: (file: File) => void;
	onMove?: (file: File) => void;
}) {
	if (!files.length && !isAdmin) return null;

	return (
		<ResourceSection
			id='files-title'
			title='الملفات'
			count={files.length}
			icon={<DescriptionOutlinedIcon />}
		>
			<SortableGrid
				items={files}
				isAdmin={isAdmin}
				gridSx={cardGridSx}
				label='الملفات'
				getHandleLabel={(file) => `إعادة ترتيب الملف: ${file.name}`}
				renderItem={(file, handle) => (
					<FileCard
						file={file}
						handle={handle}
						isAdmin={isAdmin}
						onEdit={() => onRename(file)}
						onDelete={() => onDelete(file)}
						onMove={onMove ? () => onMove(file) : undefined}
					/>
				)}
				extraItems={
					isAdmin ? (
						<Box component='li'>
							<AddResourceCard label='رفع ملف' onClick={onAdd} />
						</Box>
					) : null
				}
			/>
		</ResourceSection>
	);
}
