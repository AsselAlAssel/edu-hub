import ActionsIconButton from "@/components/ActionsIconButton";
import usePopoverState from "@/hooks/usePopoverState";
import useRole from "@/hooks/useRole";
import { ICONS_FORMAT_FILE } from "@/libs/constant";
import {
	Stack,
	Typography,
	Menu,
	ListItem,
	ListItemIcon,
	Box,
} from "@mui/material";
import { File } from "@prisma/client";
import Image from "next/image";
import { useMemo } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";

export default function FileCard({
	file,
	onEdit,
	onDelete,
}: {
	file: File;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const [open, anchorEl, handleOpen, handleClose] = usePopoverState();
	const WarperComponent = file.url !== "#" ? "a" : "div";

	const isFormatKnown = useMemo(() => {
		return ICONS_FORMAT_FILE.includes(file.type);
	}, [file.name]);
	const { isAdmin } = useRole();

	const isClosed = useMemo(() => {
		return file.url === "#";
	}, [file.url]);

	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={{
				borderRadius: 1,
				padding: 1.5,
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
		>
			<WarperComponent
				href={file.url ?? "#"}
				download={true}
				target='_blank'
				style={{ width: "100%" }}
			>
				<Typography
					variant='h6'
					sx={{
						maxWidth: "80%",
						display: "-webkit-box",
						WebkitLineClamp: 2,
						WebkitBoxOrient: "vertical",
						overflow: "hidden",
						textOverflow: "ellipsis",
						cursor: "pointer",
					}}
				>
					{file.name}
				</Typography>

				<Stack
					justifyContent='center'
					alignItems='center'
					p={3}
					sx={{
						borderRadius: 1,
						backgroundColor: "#FFFFFF",
						mt: 2,
						position: "relative",
					}}
				>
					{isFormatKnown ? (
						<Image
							src={`/icons/${file.type}.svg`}
							alt={file.type}
							width={70}
							height={70}
						/>
					) : (
						<Image
							src={`/icons/unknown.svg`}
							alt={file.type}
							width={70}
							height={70}
						/>
					)}
					{isClosed ? (
						<Box
							sx={{
								position: "absolute",
								top: "0",
								right: "0",
								bottom: "0",
								left: "0",
								backgroundColor: "rgba(0,0,0,0.5)",
								backdropFilter: "blur(5px)",
								display: "flex",
								justifyContent: "center",
								alignItems: "center",
								borderRadius: 1,
							}}
						>
							<LockIcon
								sx={{
									color: "white",
								}}
							/>
						</Box>
					) : null}
				</Stack>
			</WarperComponent>
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
			{isAdmin ? (
				<ActionsIconButton
					sx={{
						position: "absolute",
						top: 10,
						right: 10,
					}}
					onClick={(e) => {
						e.stopPropagation();
						handleOpen(e);
					}}
				/>
			) : null}
		</Stack>
	);
}
