import ActionsIconButton from "@/components/ActionsIconButton";
import usePopoverState from "@/hooks/usePopoverState";
import useRole from "@/hooks/useRole";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	Box,
	IconButton,
	ListItem,
	ListItemIcon,
	Menu,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { Video } from "@prisma/client";
import { useMemo } from "react";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	height: 45,
	width: 45,
	borderRadius: "50%",
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	transition: "background-color 0.3s ease-in-out",
	"&:hover": {
		backgroundColor: theme.palette.primary.light,
	},
}));

export default function VideoCard({
	video,
	onChangeName,
	onDelete,
	onPlay,
}: {
	video: Video;
	onChangeName: () => void;
	onDelete: () => void;
	onPlay: () => void;
}) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const { isAdmin } = useRole();
	const isClosed = useMemo(() => {
		return video.url === "#";
	}, [video.url]);

	return (
		<Stack
			sx={{
				borderRadius: 1,
				overflow: "hidden",
				cursor: "pointer",
				width: "100%",
				backgroundColor: "#F0F4F9",
				flex: 1,
				top: 0,
				transition: "top 0.3s ease-in-out",
				position: "relative",
				"& .absolute-button": {
					display: "none",
				},

				"&:hover": {
					backgroundColor: "#DCE6F1",
					...(!isAdmin && {
						top: "-10px",
					}),
				},
			}}
			gap={1}
			onClick={() => {
				if (!isClosed) {
					onPlay();
				}
			}}
		>
			<Box
				sx={{
					position: "relative",
				}}
			>
				<img
					src={video.thumbnail}
					alt={video.name}
					style={{
						width: "100%",
						height: "auto",
						objectFit: "cover",
					}}
				/>
				{isClosed ? (
					<StyledIconButton
						sx={{
							position: "absolute",
							top: "100%",
							right: "10px",
							transform: "translateY(-50%)",
							zIndex: 1,
						}}
					>
						<LockIcon />
					</StyledIconButton>
				) : (
					<StyledIconButton
						sx={{
							position: "absolute",
							top: "100%",
							right: "10px",
							transform: "translateY(-50%)",
							zIndex: 1,
						}}
					>
						<PlayArrowIcon />
					</StyledIconButton>
				)}
			</Box>
			<Typography
				variant='h6'
				sx={{
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					maxWidth: "80%",
					padding: 1,
				}}
			>
				{video.name}
			</Typography>

			{isAdmin ? (
				<ActionsIconButton
					sx={{
						position: "absolute",
						top: "10px",
						right: "10px",
						zIndex: 1,
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleOpen(e);
					}}
				/>
			) : null}
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
						onChangeName();
						handleClose();
					}}
				>
					<ListItemIcon>
						<EditIcon />
					</ListItemIcon>
					<Typography>تفير الإسم</Typography>
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
