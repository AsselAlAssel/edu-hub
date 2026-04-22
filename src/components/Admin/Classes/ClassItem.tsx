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
	alpha,
	Box,
	ListItem,
	ListItemIcon,
	ListItemText,
	Menu,
	Stack,
	Typography,
} from "@mui/material";
import { Class } from "@prisma/client";
import type { Theme } from "@mui/material/styles";
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
				sx={(theme) => ({
					borderRadius: "16px",
					border: `1px solid ${theme.palette.border.secondary}`,
					overflow: "hidden",
					position: "relative",
					display: "flex",
					cursor: "pointer",
					width: "100%",
					backgroundColor: theme.palette.background.paper,
					color: theme.palette.text.primary,
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					boxShadow: shadowsFromTheme(theme),
					"&:hover": {
						boxShadow: shadowsHoverFromTheme(theme),
						borderColor: theme.palette.border.main,
						...(!isAdmin && {
							transform: "translateY(-3px)",
						}),
					},
					"&:focus-within": {
						borderColor: "primary.main",
						boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
					},
				})}
			>
				<Link
					href={`/class/${classItem.id}/folder/${classItem?.folders[0]?.id}`}
					style={{ width: "100%", textDecoration: "none", color: "inherit" }}
				>
					<Stack direction='column'>
						<Box
							sx={(theme) => ({
								height: "168px",
								width: "100%",
								backgroundColor:
									theme.palette.mode === "dark"
										? alpha(theme.palette.primary.main, 0.06)
										: theme.palette.background.default,
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								overflow: "hidden",
								position: "relative",
							})}
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
								<Box
									sx={(theme) => ({
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										width: "100%",
										height: "100%",
										background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${theme.palette.background.default} 100%)`,
									})}
								>
									<Image
										src='/images/logo/logo.svg'
										alt='شروحات الفيزياء لجميع الصفوف - محمد صبح | Mohammed Subuh'
										width={56}
										height={56}
										style={{ opacity: 0.4 }}
									/>
								</Box>
							)}
						</Box>
						<Box sx={{ px: 2.5, py: 2.5 }}>
							<Typography
								variant='h6'
								sx={(theme) => ({
									overflow: "hidden",
									textOverflow: "ellipsis",
									display: "-webkit-box",
									WebkitLineClamp: 2,
									WebkitBoxOrient: "vertical",
									fontWeight: 700,
									lineHeight: 1.5,
									color: theme.palette.text.primary,
								})}
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
					sx={{ cursor: "pointer" }}
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
					sx={{ cursor: "pointer" }}
					onClick={(e) => {
						e.stopPropagation();
						if (selectedClass) {
							setOpenDeleteDialog(true);
						}
						handleClose();
					}}
				>
					<ListItemIcon>
						<DeleteIcon sx={{ color: "error.main" }} />
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

function shadowsFromTheme(theme: Theme) {
	return theme.palette.mode === "dark"
		? "0 4px 20px rgba(0,0,0,0.35)"
		: "0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)";
}

function shadowsHoverFromTheme(theme: Theme) {
	return theme.palette.mode === "dark"
		? "0 12px 32px rgba(0,0,0,0.45)"
		: "0 8px 24px rgba(16, 24, 40, 0.08), 0 4px 8px rgba(16, 24, 40, 0.03)";
}
