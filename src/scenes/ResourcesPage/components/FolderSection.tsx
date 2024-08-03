import { Box, Grid, Typography } from "@mui/material";
import { Folder } from "@prisma/client";
import React, { useState } from "react";
import FolderCard from "./FolderCard";
import AddFolderCard from "./AddFolderCard";
import DeleteDialog from "@/components/DeleteDialog";
import FolderForm from "@/components/FolderForm";
import { useDeleteFolder } from "@/hooks/useFolderApis";
import { mutate } from "swr";
import useRole from "@/hooks/useRole";

export default function FolderSection({
	folders,
	classId,
	folderId,
}: {
	folders: Folder[];
	classId: string;
	folderId: string;
}) {
	const [openFolderForm, setOpenFolderForm] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
	const { deleteFolder, isDeletingFolder } = useDeleteFolder();
	const { isAdmin } = useRole();
	return (
		<Box>
			<Typography variant='h5' mb={2}>
				المجلدات
			</Typography>
			<Grid container spacing={2}>
				{folders.map((folder) => (
					<Grid
						item
						key={folder.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<FolderCard
							folder={folder}
							onEdit={() => {
								setSelectedFolder(() => folder);
								setOpenFolderForm(() => true);
							}}
							onDelete={() => {
								setSelectedFolder(folder);
								setOpenDeleteDialog(true);
							}}
						/>
					</Grid>
				))}
				{isAdmin && (
					<Grid
						item
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<AddFolderCard
							onClick={() => {
								setOpenFolderForm(true);
							}}
						/>
					</Grid>
				)}
			</Grid>
			<DeleteDialog
				deleteDialogOpen={openDeleteDialog}
				handleDeleteDialogClose={() => {
					setOpenDeleteDialog(false);
					setSelectedFolder(null);
				}}
				handleDelete={async () => {
					if (!selectedFolder) return;
					await deleteFolder({ folderId: selectedFolder?.id || "" });
					mutate(
						`/api/resources/${selectedFolder?.parentFolderId || folderId}`
					);
					setOpenDeleteDialog(false);
					setSelectedFolder(null);
				}}
				title='حذف المجلد'
				description='هل تريد بالتأكيد حذف هذا المجلد؟'
				isDeleting={isDeletingFolder}
			/>
			<FolderForm
				open={openFolderForm}
				handleClose={() => {
					setOpenFolderForm(false);
					setSelectedFolder(null);
				}}
				classId={selectedFolder?.classId || classId}
				folderId={selectedFolder?.id || folderId}
				title={selectedFolder ? "تعديل المجلد" : "إضافة مجلد جديد"}
				folderName={selectedFolder?.name}
				parentFolderId={selectedFolder?.parentFolderId || ""}
			/>
		</Box>
	);
}
