import ActionsIconButton from "@/components/ActionsIconButton";
import useRole from "@/hooks/useRole";
import { alpha, Stack, Typography, Box } from "@mui/material";
import { File } from "@prisma/client";
import Image from "next/image";
import type { CSSProperties } from "react";
import LockIcon from "@mui/icons-material/Lock";
import ResourceCardActionsMenu from "./ResourceCardActionsMenu";
import { useFileCard } from "./useFileCard";

export default function FileCard({
	file,
	onEdit,
	onDelete,
}: {
	file: File;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const {
		menuOpen,
		anchorEl,
		handleOpen,
		handleClose,
		isFormatKnown,
		isClosed,
		isLink,
	} = useFileCard(file);
	const { isAdmin } = useRole();

	const linkShellStyle: CSSProperties = {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		height: "100%",
		textDecoration: "none",
		color: "inherit",
	};

	const cardInner = (
		<>
			<Typography
				variant='h6'
				sx={(theme) => ({
					maxWidth: "80%",
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
					textOverflow: "ellipsis",
					cursor: "pointer",
					minHeight: "3.6rem",
					lineHeight: "1.8rem",
					color: theme.palette.text.primary,
				})}
			>
				{file.name}
			</Typography>

			<Stack
				justifyContent='center'
				alignItems='center'
				p={3}
				sx={(theme) => ({
					borderRadius: 1,
					backgroundColor: theme.palette.background.paper,
					mt: 2,
					position: "relative",
					border: `1px solid ${theme.palette.border.secondary}`,
				})}
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
								color: "common.white",
							}}
						/>
					</Box>
				) : null}
			</Stack>
		</>
	);

	return (
		<Stack
			direction='row'
			alignItems='center'
			sx={(theme) => ({
				borderRadius: 1,
				padding: 1.5,
				cursor: "pointer",
				width: "100%",
				color: theme.palette.text.primary,
				backgroundColor:
					theme.palette.mode === "dark"
						? alpha(theme.palette.background.paper, 0.9)
						: alpha(theme.palette.primary.main, 0.04),
				flex: 1,
				top: 0,
				transition:
					"top 0.3s ease-in-out, box-shadow 0.3s ease, background-color 0.2s ease",
				position: "relative",
				height: "100%",
				border: `1px solid ${theme.palette.border.secondary}`,
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
		>
			{isLink ? (
				<a
					href={file.url ?? "#"}
					download
					target='_blank'
					style={linkShellStyle}
				>
					{cardInner}
				</a>
			) : (
				<div style={linkShellStyle}>{cardInner}</div>
			)}
			<ResourceCardActionsMenu
				anchorEl={anchorEl}
				open={menuOpen}
				onClose={handleClose}
				editLabel='تفير الإسم'
				onEdit={onEdit}
				onDelete={onDelete}
			/>
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
