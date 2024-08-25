import { Box, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import FileCard from "./FileCard";
import { File } from "@prisma/client";
import AddFileCard from "./AddFileCard";
import useRole from "@/hooks/useRole";
import AttachmentsForm from "@/components/AttachmentsForm";
import DeleteDialog from "@/components/DeleteDialog";
import { useDeleteFile, useUpdateFileName } from "@/hooks/useResourceApi";
import { mutate } from "swr";
import ChangeNameForm from "@/components/ChangeNameForm";
import { deleteObjectFromR2 } from "@/actions/upload";

export default function FilesSection({
	files,
	classId,
	folderId,
}: {
	files: File[];
	classId: string;
	folderId: string;
}) {
	const [open, setOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [openChangeName, setOpenChangeName] = useState(false);
	const [openDelete, setOpenDelete] = useState(false);
	const { isAdmin } = useRole();
	const { deleteFile, isLoading } = useDeleteFile();
	const { isLoading: isUpdatingName, updateFileName } = useUpdateFileName();
	const isDataEmpty = files.length === 0;
	if (isDataEmpty && !isAdmin) return null;
	return (
		<Box>
			<Typography variant='h5' mb={2}>
				الملفات
			</Typography>
			<Grid container spacing={2}>
				{files.map((file) => (
					<Grid
						item
						key={file.id}
						xs={12}
						sm={6}
						md={4}
						lg={3}
						sx={{
							display: "flex",
							width: "100%",
						}}
					>
						<FileCard
							file={file}
							onEdit={() => {
								setSelectedFile(file);
								setOpenChangeName(true);
							}}
							onDelete={() => {
								setSelectedFile(file);
								setOpenDelete(true);
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
						<AddFileCard onClick={() => setOpen(true)} />
					</Grid>
				)}
			</Grid>
			<AttachmentsForm
				open={open}
				handleClose={() => setOpen(false)}
				title={"إضافة ملفات جدد"}
				folderId={folderId}
				classId={classId}
			/>
			<DeleteDialog
				deleteDialogOpen={openDelete}
				handleDeleteDialogClose={() => {
					setOpenDelete(false);
					setSelectedFile(null);
				}}
				handleDelete={async () => {
					if (!selectedFile) return;
					mutate(
						`/api/resources/${folderId}`,
						deleteFile({ fileId: selectedFile?.id || "" }),
						{
							optimisticData: (oldData) => {
								return {
									...oldData,
									files: oldData.files.filter(
										(file: File) => file.id !== selectedFile?.id
									),
								};
							},
							populateCache: false,
							revalidate: false,
						}
					);
					const url = selectedFile.url;
					const key = url.split("/").pop() as string;
					await deleteObjectFromR2(key);
					setOpenDelete(false);
				}}
				title='حذف المجلد'
				description='هل تريد بالتأكيد حذف هذا المجلد؟'
				isDeleting={isLoading}
			/>
			<ChangeNameForm
				open={openChangeName && !!selectedFile}
				handleClose={() => {
					setOpenChangeName(false);
					setSelectedFile(null);
				}}
				isUpdatingName={isUpdatingName}
				onSubmit={async (name) => {
					if (!selectedFile) return;
					await updateFileName({
						fileId: selectedFile?.id || "",
						name,
					});
					mutate(`/api/resources/${selectedFile?.folderId || folderId}`);
					setOpenChangeName(false);
					setSelectedFile(null);
				}}
				title='تعديل اسم الملف'
				name={selectedFile?.name || ""}
			/>
		</Box>
	);
}
