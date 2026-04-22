import ActionsIconButton from "@/components/ActionsIconButton";
import CustomTooltip from "@/components/CustomTooltip";
import useRole from "@/hooks/useRole";
import FolderIcon from "@mui/icons-material/Folder";
import { alpha, Box, Stack, Typography } from "@mui/material";
import { Folder } from "@prisma/client";
import Link from "next/link";
import ResourceCardActionsMenu from "./ResourceCardActionsMenu";
import { useFolderCard } from "./useFolderCard";

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
	const [open, anchorEl, handleOpen, handleClose] = useFolderCard();
	const { isAdmin } = useRole();
	return (
		<Stack
			direction='row'
			justifyContent={"space-between"}
			alignItems={"center"}
			sx={(theme) => ({
				border: isDropTarget
					? `2px dashed ${theme.palette.primary.main}`
					: isDraggingOver
						? `2px dashed ${alpha(theme.palette.primary.main, 0.45)}`
						: `1px solid ${theme.palette.border.main}`,
				borderRadius: "10px",
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor: isDropTarget
					? alpha(theme.palette.primary.main, 0.12)
					: isDraggingOver
						? alpha(theme.palette.primary.main, 0.06)
						: theme.palette.mode === "dark"
							? alpha(theme.palette.background.paper, 0.85)
							: theme.palette.background.default,
				transition: "all 0.2s ease",
				transform: isDropTarget ? "scale(1.02)" : "none",
				boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
				"&:hover": {
					backgroundColor: isDropTarget
						? alpha(theme.palette.primary.main, 0.14)
						: theme.palette.action.hover,
					borderColor: isDropTarget
						? theme.palette.primary.main
						: theme.palette.text.disabled,
					boxShadow: "0px 2px 6px rgba(16, 24, 40, 0.08)",
				},
			})}
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
							sx={(theme) => ({
								color: isDropTarget
									? theme.palette.primary.main
									: "text.secondary",
								flexShrink: 0,
							})}
						/>
						<Typography
							variant='h6'
							sx={(theme) => ({
								flex: 1,
								maxWidth: isAdmin ? "80%" : "100%",
								overflow: "hidden",
								textOverflow: "ellipsis",
								display: "-webkit-box",
								WebkitLineClamp: 2,
								WebkitBoxOrient: "vertical",
								lineHeight: "1.8rem",
								color: isDropTarget
									? theme.palette.primary.main
									: theme.palette.text.primary,
							})}
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
			<ResourceCardActionsMenu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				editLabel='تعديل'
				onEdit={onEdit}
				onDelete={onDelete}
			/>
		</Stack>
	);
}
