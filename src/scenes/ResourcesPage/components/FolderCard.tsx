import ActionsIconButton from "@/components/ActionsIconButton";
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
}: {
	folder: Folder;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const { isAdmin } = useRole();
	return (
		<Stack
			direction='row'
			alignItems='center'
			justifyContent={"space-between"}
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
			<Link
				href={`/class/${folder.classId}/folder/${folder.id}`}
				style={{
					flex: 1,
					maxWidth: "80%",
				}}
			>
				<Stack direction='row' gap={1} alignItems='center'>
					<FolderIcon />
					<Typography
						variant='h6'
						sx={{
							//ellipsis
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
							flex: 1,
							maxWidth: "80%",
						}}
					>
						{folder.name}
					</Typography>
				</Stack>
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
