"use client";
import dynamic from "next/dynamic";
import ActionsMenu from "@/components/ui/ActionsMenu";
import Surface from "@/components/ui/Surface";
import { useDeleteClass } from "@/hooks/useClassApi";
import useRole from "@/hooks/useRole";
import { getErrorMessage } from "@/libs/errors";
import type { ClassWithMeta } from "@/libs/class";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";

// Admin-only dialogs: loaded on demand (visitors never download them).
const ClassDialog = dynamic(() => import("@/components/ClassDialog"), {
	ssr: false,
});
const ConfirmDialog = dynamic(() => import("@/components/ui/ConfirmDialog"), {
	ssr: false,
});

/** "3 فيديوهات · 5 ملفات" — only when the backend returned real counts. */
export function resourceSummary(counts?: { videos: number; files: number }) {
	if (!counts) return null;
	const parts: string[] = [];
	if (counts.videos)
		parts.push(
			`${counts.videos} ${counts.videos === 1 ? "فيديو" : "فيديوهات"}`
		);
	if (counts.files)
		parts.push(`${counts.files} ${counts.files === 1 ? "ملف" : "ملفات"}`);
	return parts.length ? parts.join(" · ") : null;
}

const ACCENTS = ["cyan", "violet", "azure", "amber"] as const;

export default function ClassItem({
	classItem,
	priority = false,
	index = 0,
}: {
	classItem: ClassWithMeta;
	priority?: boolean;
	/** Position in the grid: picks the card's accent colour. */
	index?: number;
}) {
	const accentKey = ACCENTS[index % ACCENTS.length];
	const { isAdmin } = useRole();
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const { deleteClass, isDeleting } = useDeleteClass();
	const rootFolderId = classItem.folders?.[0]?.id;
	const href = rootFolderId
		? `/class/${classItem.id}/folder/${rootFolderId}`
		: undefined;
	const summary = resourceSummary(classItem._count);
	const editValues = useMemo(
		() => ({
			name: classItem.name,
			description: classItem.description ?? "",
			image: classItem.image ?? "",
		}),
		[classItem.name, classItem.description, classItem.image]
	);

	const handleDelete = async () => {
		try {
			await deleteClass({ id: classItem.id });
			await mutate("/api/class");
			toast.success("تم حذف الصف");
			setDeleteOpen(false);
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر حذف الصف"));
		}
	};

	return (
		<>
			<Surface
				component='article'
				interactive
				sx={(theme) => ({
					display: "flex",
					flexDirection: "column",
					height: "100%",
					overflow: "hidden",
					"& .qa-class-media img": {
						transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
					},
					"&:hover .qa-class-media img": { transform: "scale(1.06)" },
					"&:hover .qa-class-cta": { color: theme.tokens.colors[accentKey] },
					"&:hover .qa-class-cta svg": { transform: "translateX(-5px)" },
				})}
			>
				<Box
					className='qa-class-media'
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "16 / 9",
						overflow: "hidden",
						backgroundColor: theme.tokens.colors.surfaceSecondary,
						// Accent beam along the media's lower edge.
						"&::after": {
							content: '""',
							position: "absolute",
							insetInline: 0,
							bottom: 0,
							height: 3,
							zIndex: 1,
							background: `linear-gradient(90deg, transparent, ${theme.tokens.colors[accentKey]}, transparent)`,
						},
					})}
				>
					{classItem.image ? (
						<Image
							src={classItem.image}
							alt=''
							fill
							priority={priority}
							sizes='(max-width: 600px) 100vw, (max-width: 900px) 50vw, (max-width: 1200px) 33vw, 300px'
							style={{ objectFit: "cover" }}
						/>
					) : (
						<Box
							aria-hidden
							sx={(theme) => {
								const accent = theme.tokens.colors[accentKey];
								return {
									position: "absolute",
									inset: 0,
									display: "grid",
									placeItems: "center",
									backgroundImage: `radial-gradient(80% 90% at 100% 0%, ${alpha(accent, 0.32)}, transparent 70%), radial-gradient(70% 80% at 0% 100%, ${alpha(theme.tokens.colors.violet, 0.2)}, transparent 70%), linear-gradient(${alpha(accent, 0.08)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(accent, 0.08)} 1px, transparent 1px)`,
									backgroundSize: "auto, auto, 24px 24px, 24px 24px",
								};
							}}
						>
							<Box
								className='qa-latin'
								sx={(theme) => ({
									fontSize: { xs: "3rem", md: "3.5rem" },
									fontWeight: 700,
									lineHeight: 1,
									color: alpha(theme.tokens.colors[accentKey], 0.9),
									textShadow: `0 0 30px ${alpha(theme.tokens.colors[accentKey], 0.5)}`,
								})}
							>
								{classItem.name.trim().charAt(0)}
							</Box>
						</Box>
					)}
				</Box>

				<Stack
					direction='row'
					alignItems='flex-start'
					gap={1}
					sx={{ p: 2.5, pb: 1.5, flex: 1 }}
				>
					<Box sx={{ flex: 1, minWidth: 0 }}>
						<Typography
							variant='h5'
							component='h2'
							sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
						>
							{href ? (
								<Box
									component={Link}
									href={href}
									sx={{
										color: "text.primary",
										textDecoration: "none",
										// Stretched link: the whole card is clickable, one tab stop.
										"&::after": {
											content: '""',
											position: "absolute",
											inset: 0,
											zIndex: 1,
										},
										"&:focus-visible": { outline: "none" },
										"&:focus-visible::after": {
											outline: (theme) =>
												`2px solid ${theme.palette.primary.main}`,
											outlineOffset: -2,
											borderRadius: (theme) => `${theme.tokens.radii.lg}px`,
										},
									}}
								>
									{classItem.name}
								</Box>
							) : (
								classItem.name
							)}
						</Typography>
						{summary ? (
							<Typography
								variant='caption'
								sx={(theme) => ({
									display: "inline-block",
									mt: 1.25,
									px: 1.25,
									py: 0.25,
									borderRadius: `${theme.tokens.radii.full}px`,
									fontWeight: 600,
									color: theme.tokens.colors[accentKey],
									backgroundColor: alpha(theme.tokens.colors[accentKey], 0.12),
									border: `1px solid ${alpha(theme.tokens.colors[accentKey], 0.3)}`,
								})}
							>
								{summary}
							</Typography>
						) : null}
					</Box>
					{isAdmin ? (
						<ActionsMenu
							label={`خيارات الصف: ${classItem.name}`}
							editLabel='تعديل الصف'
							deleteLabel='حذف الصف'
							onEdit={() => setEditOpen(true)}
							onDelete={() => setDeleteOpen(true)}
						/>
					) : null}
				</Stack>
				{href ? (
					<Stack
						aria-hidden
						className='qa-class-cta'
						direction='row'
						alignItems='center'
						gap={0.75}
						sx={(theme) => ({
							px: 2.5,
							pb: 2.25,
							fontSize: "0.875rem",
							fontWeight: 600,
							color: "text.secondary",
							transition: theme.transitions.create("color"),
							"& svg": {
								fontSize: 18,
								transition: theme.transitions.create("transform"),
							},
						})}
					>
						ابدأ التعلّم
						<ArrowBackRoundedIcon />
					</Stack>
				) : null}
			</Surface>

			{isAdmin ? (
				<>
					<ClassDialog
						open={editOpen}
						handleCloseDialog={() => setEditOpen(false)}
						selectedClass={editValues}
						classId={classItem.id}
					/>
					<ConfirmDialog
						open={deleteOpen}
						title='حذف الصف'
						description={`سيتم حذف «${classItem.name}» مع جميع مجلداته وملفاته وفيديوهاته. لا يمكن التراجع عن ذلك.`}
						confirmLabel='حذف الصف'
						onConfirm={handleDelete}
						onClose={() => setDeleteOpen(false)}
						loading={isDeleting}
					/>
				</>
			) : null}
		</>
	);
}
