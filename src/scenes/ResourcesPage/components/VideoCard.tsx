import ActionsIconButton from "@/components/ActionsIconButton";
import useRole from "@/hooks/useRole";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
	alpha,
	Box,
	IconButton,
	Stack,
	styled,
	Typography,
} from "@mui/material";
import { Video } from "@prisma/client";
import ResourceCardActionsMenu from "./ResourceCardActionsMenu";
import { useVideoCard } from "./useVideoCard";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	height: 45,
	width: 45,
	borderRadius: "50%",
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	transition: "background-color 0.3s ease-in-out",
	"&:hover": {
		backgroundColor: theme.palette.primary.dark,
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
	const { menuOpen, anchorEl, handleOpen, handleClose, handleCardClick } =
		useVideoCard();
	const { isAdmin } = useRole();
	const isClosed = false;

	return (
		<Stack
			sx={(theme) => ({
				borderRadius: 1,
				overflow: "hidden",
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor:
					theme.palette.mode === "dark"
						? alpha(theme.palette.background.paper, 0.9)
						: alpha(theme.palette.primary.main, 0.04),
				border: `1px solid ${theme.palette.border.secondary}`,
				flex: 1,
				top: 0,
				transition:
					"top 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.2s ease",
				position: "relative",
				"& .absolute-button": {
					display: "none",
				},

				"&:hover": {
					backgroundColor:
						theme.palette.mode === "dark"
							? theme.palette.background.paper
							: alpha(theme.palette.primary.main, 0.08),
					boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)",
					...(!isAdmin && {
						top: "-6px",
					}),
				},
			})}
			gap={1}
			onClick={() => {
				if (!isClosed) {
					handleCardClick(onPlay);
				}
			}}
		>
			<Box
				sx={{
					position: "relative",
				}}
			>
				<img
					src={video.thumbnailUrl}
					alt={video.name}
					style={{
						width: "100%",
						height: "auto",
						objectFit: "cover",
						display: "block",
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
				sx={(theme) => ({
					overflow: "hidden",
					textOverflow: "ellipsis",
					whiteSpace: "nowrap",
					maxWidth: "80%",
					padding: 1,
					color: theme.palette.text.primary,
				})}
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
			<ResourceCardActionsMenu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleClose}
				editLabel='تفير الإسم'
				onEdit={onChangeName}
				onDelete={onDelete}
			/>
		</Stack>
	);
}
