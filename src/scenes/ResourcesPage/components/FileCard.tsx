"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import IconTile from "@/components/ui/IconTile";
import Surface from "@/components/ui/Surface";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Stack, Typography } from "@mui/material";
import type { File } from "@prisma/client";
import type { ReactNode } from "react";
import { getFileTypeInfo } from "./fileTypes";

/** A file is "closed" when stored with the "#" placeholder URL. */
export const isFileAvailable = (file: Pick<File, "url">) =>
	!!file.url && file.url !== "#";

export default function FileCard({
	file,
	handle,
	onEdit,
	onDelete,
	isAdmin = false,
	onMove,
}: {
	file: File;
	handle?: ReactNode;
	onEdit: () => void;
	onDelete: () => void;
	isAdmin?: boolean;
	onMove?: () => void;
}) {
	const info = getFileTypeInfo(file.type);
	const available = isFileAvailable(file);

	return (
		<Surface
			interactive={available}
			component='article'
			data-testid='file-card'
			sx={{
				height: "100%",
				p: 2,
				display: "flex",
				flexDirection: "column",
				gap: 2,
			}}
		>
			<Stack
				direction='row'
				alignItems='flex-start'
				justifyContent='space-between'
				gap={1}
			>
				<IconTile tone={info.tone} size={48}>
					{info.icon}
				</IconTile>
				{isAdmin ? (
					<Stack direction='row' gap={0.75}>
						{handle}
						<ActionsMenu
							label={`خيارات الملف: ${file.name}`}
							editLabel='إعادة تسمية الملف'
							deleteLabel='حذف الملف'
							onEdit={onEdit}
							onDelete={onDelete}
							onMove={onMove}
						/>
					</Stack>
				) : null}
			</Stack>

			<Typography
				variant='subtitle2'
				component='h3'
				sx={{
					fontSize: "0.9375rem",
					flex: 1,
					display: "-webkit-box",
					WebkitLineClamp: 2,
					WebkitBoxOrient: "vertical",
					overflow: "hidden",
					overflowWrap: "anywhere",
				}}
			>
				{available ? (
					<Box
						component='a'
						href={file.url}
						target='_blank'
						rel='noopener noreferrer'
						download
						aria-label={`تحميل ${file.name} (${info.label})`}
						sx={(theme) => ({
							color: "text.primary",
							textDecoration: "none",
							"&::after": {
								content: '""',
								position: "absolute",
								inset: 0,
								zIndex: 1,
							},
							"&:focus-visible": { outline: "none" },
							"&:focus-visible::after": {
								outline: `2px solid ${theme.palette.primary.main}`,
								outlineOffset: -2,
								borderRadius: `${theme.tokens.radii.lg}px`,
							},
						})}
					>
						{file.name}
					</Box>
				) : (
					file.name
				)}
			</Typography>

			<Stack
				direction='row'
				alignItems='center'
				justifyContent='space-between'
				sx={(theme) => ({
					pt: 1.5,
					borderTop: `1px solid ${theme.tokens.colors.border}`,
				})}
			>
				<Typography variant='caption' sx={{ color: "text.secondary" }}>
					{info.label}
					<Box
						component='span'
						dir='ltr'
						sx={{ mx: 0.75, textTransform: "uppercase" }}
					>
						.{file.type}
					</Box>
				</Typography>
				<Stack
					direction='row'
					alignItems='center'
					gap={0.5}
					aria-hidden
					sx={{
						color: available ? "primary.main" : "text.secondary",
						fontWeight: 700,
						fontSize: "0.8125rem",
					}}
				>
					{available ? (
						<>
							<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />
							تحميل
						</>
					) : (
						<>
							<LockOutlinedIcon sx={{ fontSize: 18 }} />
							غير متاح
						</>
					)}
				</Stack>
			</Stack>
		</Surface>
	);
}
