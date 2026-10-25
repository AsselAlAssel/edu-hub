"use client";
import dynamic from "next/dynamic";
import ActionsMenu from "@/components/ui/ActionsMenu";
import Surface from "@/components/ui/Surface";
import { useDeleteClass } from "@/hooks/useClassApi";
import { setClassHiddenRequest } from "@/services/class.service";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import useRole from "@/hooks/useRole";
import { getErrorMessage } from "@/libs/errors";
import type { ClassWithMeta } from "@/libs/class";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import useProgress, { completedIn } from "@/hooks/useProgress";
import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import { canOptimizeImage } from "@/libs/images";
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
	const progress = useProgress();
	const totalVideos = classItem._count?.videos ?? 0;
	const done = completedIn(progress.items, classItem.id);
	const showProgress = progress.signedIn && !isAdmin && totalVideos > 0;
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

	const handleToggleHidden = async () => {
		try {
			await setClassHiddenRequest({
				id: classItem.id,
				hidden: !classItem.hidden,
			});
			await mutate("/api/class");
			toast.success(
				classItem.hidden ? "أصبح الصف ظاهراً للطلاب" : "تم إخفاء الصف عن الطلاب"
			);
		} catch (error) {
			toast.error(getErrorMessage(error, "تعذّر تغيير ظهور الصف"));
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
							unoptimized={!canOptimizeImage(classItem.image)}
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
					{classItem.hidden ? (
						<Chip
							size='small'
							icon={<VisibilityOffOutlinedIcon />}
							label='مخفي عن الطلاب'
							sx={{
								position: "absolute",
								top: 12,
								insetInlineStart: 12,
								zIndex: 2,
								fontWeight: 600,
								color: "common.white",
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								backdropFilter: "blur(4px)",
								"& .MuiChip-icon": { color: "inherit" },
							}}
						/>
					) : null}
					{classItem._count?.folders ? (
						<Chip
							size='small'
							icon={<SellOutlinedIcon />}
							label='فيه وحدات مدفوعة'
							sx={{
								position: "absolute",
								top: 12,
								insetInlineEnd: 12,
								zIndex: 2,
								fontWeight: 600,
								color: "common.white",
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								backdropFilter: "blur(4px)",
								"& .MuiChip-icon": { color: "inherit" },
							}}
						/>
					) : null}
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
						{showProgress ? (
							<Box sx={{ mt: 1.5 }}>
								<Typography
									variant='caption'
									sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
								>
									أنهيت {done} من {totalVideos} فيديو
								</Typography>
								<LinearProgress
									variant='determinate'
									value={(done / totalVideos) * 100}
									aria-label={`أنهيت ${done} من ${totalVideos} فيديو في ${classItem.name}`}
									sx={{ height: 6, borderRadius: 3 }}
								/>
							</Box>
						) : null}
					</Box>
					{isAdmin ? (
						<ActionsMenu
							label={`خيارات الصف: ${classItem.name}`}
							editLabel='تعديل الصف'
							deleteLabel='حذف الصف'
							onEdit={() => setEditOpen(true)}
							onDelete={() => setDeleteOpen(true)}
							onToggleHidden={handleToggleHidden}
							hidden={classItem.hidden}
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
