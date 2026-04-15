import ActionsIconButton from "@/components/ActionsIconButton";
import CustomTooltip from "@/components/CustomTooltip";
import usePopoverState from "@/hooks/usePopoverState";
import useRole from "@/hooks/useRole";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import {
	Box,
	ListItem,
	ListItemIcon,
	Menu,
	Stack,
	Typography,
} from "@mui/material";
import { Folder } from "@prisma/client";
import Link from "next/link";

export default function FolderCard({
	folder,
	onEdit,
	onDelete,
	isDropTarget,
	isDraggingOver,
}: {
	folder: Folder;
	onEdit: () => void;
	onDelete: () => void;
	isDropTarget?: boolean;
	isDraggingOver?: boolean;
}) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const { isAdmin } = useRole();
	return (
		<Stack
			direction='row'
			justifyContent={"space-between"}
			alignItems={"center"}
			sx={{
				border: isDropTarget
					? "2px dashed #1976d2"
					: isDraggingOver
						? "2px dashed #90CAF9"
						: "1px solid #D0D5DD",
				borderRadius: "10px",
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				backgroundColor: isDropTarget
					? "#E3F2FD"
					: isDraggingOver
						? "#F5F9FF"
						: "#F9FAFB",
				transition: "all 0.2s ease",
				transform: isDropTarget ? "scale(1.02)" : "none",
				boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
				"&:hover": {
					backgroundColor: isDropTarget ? "#E3F2FD" : "#F0F4F8",
					borderColor: isDropTarget ? "#1976d2" : "#98A2B3",
					boxShadow: "0px 2px 6px rgba(16, 24, 40, 0.08)",
				},
			}}
			gap={1}
		>
			<Link
				href={`/class/${folder.classId}/folder/${folder.id}`}
				style={{
					flex: 1,
					maxWidth: "80%",
					textDecoration: "none",
					color: "inherit",
				}}
			>
				<CustomTooltip title={folder.name}>
					<Stack direction='row' gap={1} alignItems='center'>
						<FolderIcon
							sx={{
								color: isDropTarget ? "#1976d2" : "red",
								flexShrink: 0,
							}}
						/>
						<Typography
							variant='h6'
							sx={{
								flex: 1,
								maxWidth: isAdmin ? "80%" : "100%",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								lineHeight: "1.8rem",
								color: isDropTarget ? "#1976d2" : undefined,
							}}
						>
							{isDropTarget ? `نقل إلى: ${folder.name}` : folder.name}
						</Typography>
					</Stack>
				</CustomTooltip>
			</Link>
			{isAdmin && (
				<Box>
					<ActionsIconButton
						onClick={(e) => {
							e.stopPropagation();
							handleOpen(e);
						}}
						sx={{
							flex: 1,
						}}
					/>
				</Box>
			)}
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
						onEdit();
						handleClose();
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<Typography>تعديل</Typography>
				</ListItem>
				<ListItem
					sx={{
						cursor: "pointer",
					}}
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
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
		</Stack>
	);
}
