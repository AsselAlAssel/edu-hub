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
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { mutate } from "swr";

export default function ClassItem({ classItem }: { classItem: any }) {
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
			<Box
				gap={2}
				sx={{
					borderRadius: 3,
					border: "1px solid",
					borderColor: "border.secondary",
					overflow: "hidden",
					position: "relative",
					display: "flex",
					cursor: "pointer",
					width: "100%",
					backgroundColor: "#FFFFFF",
					transition:
						"box-shadow 0.3s ease, transform 0.3s ease, border-color 0.3s ease",
					boxShadow:
						"0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)",
					"& .absolute-button": {
						display: "none",
					},
					"&:hover": {
						boxShadow:
							"0px 8px 24px rgba(16, 24, 40, 0.08), 0px 4px 12px rgba(16, 24, 40, 0.04)",
						borderColor: "border.main",
						...(!isAdmin && {
							transform: "translateY(-4px)",
						}),
					},
					"&:focus-within": {
						borderColor: "primary.main",
						boxShadow: "0px 0px 0px 4px rgba(0, 136, 221, 0.12)",
					},
				}}
			>
				<Link
					href={`/class/${classItem.id}/folder/${classItem?.folders[0]?.id}`}
					style={{ width: "100%", textDecoration: "none", color: "inherit" }}
				>
					<Stack direction='column'>
						<Box
							sx={{
								height: "160px",
								width: "100%",
								backgroundColor: "#F8FAFC",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
							}}
						>
							{classItem.image ? (
								<Image
									src={classItem.image}
									alt='Class Image'
									width={150}
									height={150}
									style={{
										width: "100%",
										height: "100%",
										objectFit: "cover",
									}}
								/>
							) : (
								<Image
									src='/images/logo/logo.svg'
									alt='شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh'
									width={64}
									height={64}
									style={{ opacity: 0.6 }}
								/>
							)}
						</Box>
						<Box
							sx={{
								px: 2,
								py: 2,
							}}
						>
							<Typography
								variant='h6'
								sx={{
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
								}}
							>
								{classItem.name}
							</Typography>
						</Box>
					</Stack>
				</Link>

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
			</Box>
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
						<DeleteIcon
							sx={{
								color: "error.main",
							}}
						/>
					</ListItemIcon>
					<Typography color='error.main'>حذف</Typography>
				</ListItem>
			</Menu>
			<ClassDialog
				open={openDialog}
				handleCloseDialog={() => setOpenDialog(false)}
				selectedClass={{
					name: selectedClass?.name || "",
					description: selectedClass?.description || "",
					image: selectedClass?.image || "",
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
