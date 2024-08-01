"use client";
import ActionsIconButton from "@/components/ActionsIconButton";
import ClassDialog from "@/components/ClassDialog";
import DeleteDialog from "@/components/DeleteDialog";
import { useDeleteClass } from "@/hooks/useClassApi";
import usePopoverState from "@/hooks/usePopoverState";
import useRole from "@/hooks/useRole";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
	Box,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	Stack,
	Typography,
} from "@mui/material";
import { Class } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { mutate } from "swr";

export default function ClassItem({ classItem }: { classItem: any }) {
	const router = useRouter();
	const { isAdmin } = useRole();
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const [selectedClass, setSelectedClass] = useState<Class | undefined>(
		undefined
	);
	const [openDialog, setOpenDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const { deleteClass, isDeleting } = useDeleteClass();

	const handleDeleteClass = async () => {
		if (selectedClass) {
			await deleteClass({ id: selectedClass.id });
			setOpenDeleteDialog(false);
			mutate("/api/class");
		}
	};

	return (
		<>
			<Stack
				gap={2}
				sx={{
					borderRadius: 1.25,
					boxShadow: "#ccc 0px 0px 8px 0px",
					overflow: "hidden",
					position: "relative",
					transition: "top 0.3s ease-in-out",
					display: "flex",
					top: 0,
					cursor: "pointer",
					width: "100%",
					"& .absolute-button": {
						display: "none",
					},
					...(!isAdmin && {
						"&:hover": {
							top: "-10px",
						},
					}),
				}}
				onClick={() => {
					console.log("classItem.id", classItem.id);
					router.push(
						`/class/${classItem.id}/folder/${classItem.folders[0].id}`
					);
				}}
			>
				<Box
					sx={{
						height: "150px",
						width: "100%",
						backgroundColor: "red",
					}}
				></Box>
				<Box
					sx={{
						px: 1.25,
						pb: 1.25,
					}}
				>
					<Typography variant='h6'>{classItem.name}</Typography>
				</Box>

				{isAdmin && (
					<ActionsIconButton
						sx={{
							position: "absolute",
							top: 10,
							right: 10,
							zIndex: 1,
						}}
						onClick={(e) => {
							e.stopPropagation();
							handleOpen(e);
							setSelectedClass(classItem);
						}}
					/>
				)}
			</Stack>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<ListItem
					sx={{
						cursor: "pointer",
					}}
					onClick={(e) => {
						e.stopPropagation();
						if (selectedClass) {
							setOpenDialog(true);
						}
						handleClose();
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<ListItemText>تعديل</ListItemText>
				</ListItem>
				<ListItem
					sx={{
						cursor: "pointer",
					}}
					onClick={(e) => {
						e.stopPropagation();
						if (selectedClass) {
							setOpenDeleteDialog(true);
						}
						handleClose();
					}}
				>
					<ListItemIcon>
						<DeleteIcon />
					</ListItemIcon>
					<ListItemText>حذف</ListItemText>
				</ListItem>
			</Menu>
			<ClassDialog
				open={openDialog}
				handleCloseDialog={() => setOpenDialog(false)}
				selectedClass={{
					name: selectedClass?.name || "",
					description: selectedClass?.description || "",
				}}
				classId={selectedClass?.id}
			/>
			<DeleteDialog
				deleteDialogOpen={openDeleteDialog}
				handleDeleteDialogClose={() => setOpenDeleteDialog(false)}
				title='حذف الصف'
				description='هل انت متأكد من حذف الصف?'
				handleDelete={handleDeleteClass}
				isDeleting={isDeleting}
			/>
		</>
	);
}
