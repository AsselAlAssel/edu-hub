"use client";
import { canOptimizeImage } from "@/libs/images";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState, type KeyboardEvent } from "react";

const SPRING = {
	type: "spring",
	stiffness: 260,
	damping: 30,
	mass: 0.9,
} as const;

/**
 * Cover-flow gallery: the current image in front, its neighbours turned and
 * set back on either side. Swipe/drag, tap a side card, arrows or keyboard.
 * RTL: the next image waits on the left.
 */
export default function StoryCarousel({
	images,
	title,
}: {
	images: string[];
	title: string;
}) {
	const [current, setCurrent] = useState(0);
	const count = images.length;
	const go = (i: number) => setCurrent(Math.max(0, Math.min(count - 1, i)));

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "ArrowLeft") go(current + 1);
		else if (e.key === "ArrowRight") go(current - 1);
		else return;
		e.preventDefault();
	};

	return (
		<Box role='group' aria-roledescription='معرض صور' aria-label={title}>
			<Box
				tabIndex={0}
				onKeyDown={onKeyDown}
				aria-label='اسحب أو استخدم الأسهم للتنقل بين الصور'
				sx={(theme) => ({
					position: "relative",
					aspectRatio: { xs: "1 / 1", sm: "4 / 3" },
					perspective: "1400px",
					overflow: "hidden",
					borderRadius: `${theme.tokens.radii.lg}px`,
					outline: "none",
					"&:focus-visible": {
						boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
					},
				})}
			>
				<motion.div
					drag='x'
					dragConstraints={{ left: 0, right: 0 }}
					dragElastic={0.18}
					onDragEnd={(_, { offset, velocity }) => {
						const swipe = offset.x + velocity.x * 0.2;
						// RTL: pulling right brings the left (next) card in.
						if (swipe > 60) go(current + 1);
						else if (swipe < -60) go(current - 1);
					}}
					style={{
						position: "absolute",
						inset: 0,
						transformStyle: "preserve-3d",
						cursor: "grab",
						touchAction: "pan-y",
					}}
					whileDrag={{ cursor: "grabbing" }}
				>
					{images.map((src, i) => {
						const d = i - current;
						const far = Math.abs(d);
						return (
							<motion.div
								key={src + i}
								aria-hidden={d !== 0}
								initial={false}
								animate={{
									x: `${-d * 52}%`,
									scale: 1 - Math.min(far, 3) * 0.14,
									rotateY: Math.max(-3, Math.min(3, d)) * 26,
									opacity: far > 2 ? 0 : 1,
									filter: `brightness(${1 - Math.min(far, 2) * 0.28})`,
								}}
								transition={SPRING}
								onTap={() => d !== 0 && go(i)}
								// onTap makes it focusable; keyboard users have the arrows.
								tabIndex={-1}
								style={{
									position: "absolute",
									top: "6%",
									bottom: "6%",
									insetInlineStart: "18%",
									width: "64%",
									zIndex: 10 - far,
									pointerEvents: far > 2 ? "none" : "auto",
									cursor: d === 0 ? "inherit" : "pointer",
								}}
							>
								<Box
									sx={(theme) => ({
										position: "relative",
										height: "100%",
										overflow: "hidden",
										borderRadius: `${theme.tokens.radii.lg}px`,
										border: `1px solid ${alpha(theme.palette.common.white, 0.18)}`,
										backgroundColor: theme.tokens.colors.surfaceSecondary,
										boxShadow:
											d === 0
												? `0 14px 28px -14px ${alpha(theme.tokens.colors.violet, 0.5)}, 0 10px 20px -12px rgba(0,0,0,0.45)`
												: "0 16px 30px -18px rgba(0,0,0,0.55)",
									})}
								>
									{/* Blurred fill behind the uncropped image. */}
									<Image
										src={src}
										alt=''
										fill
										sizes='200px'
										unoptimized={!canOptimizeImage(src)}
										style={{
											objectFit: "cover",
											filter: "blur(22px) saturate(1.2)",
											transform: "scale(1.2)",
										}}
									/>
									<Image
										src={src}
										alt={`${title} (${i + 1} من ${count})`}
										fill
										draggable={false}
										sizes='(max-width: 900px) 80vw, 480px'
										unoptimized={!canOptimizeImage(src)}
										style={{ objectFit: "contain" }}
									/>
								</Box>
							</motion.div>
						);
					})}
				</motion.div>
			</Box>

			<Stack
				direction='row'
				alignItems='center'
				justifyContent='center'
				gap={2}
				sx={{ mt: 2 }}
			>
				<NavButton
					label='الصورة السابقة'
					disabled={current === 0}
					onClick={() => go(current - 1)}
				>
					<ChevronRightRoundedIcon />
				</NavButton>

				<Stack alignItems='center' gap={1}>
					<Stack direction='row' gap={0.75} alignItems='center'>
						{images.map((_, i) => (
							<Box
								key={i}
								component='button'
								type='button'
								aria-label={`الصورة ${i + 1}`}
								aria-current={i === current}
								onClick={() => go(i)}
								sx={(theme) => ({
									width: i === current ? 26 : 8,
									height: 8,
									p: 0,
									border: 0,
									borderRadius: 4,
									cursor: "pointer",
									transition:
										"width 350ms cubic-bezier(0.22, 1, 0.36, 1), background 350ms",
									background:
										i === current
											? theme.tokens.gradients.primary
											: alpha(theme.palette.text.primary, 0.2),
									"&:hover": {
										background:
											i === current
												? theme.tokens.gradients.primary
												: alpha(theme.palette.text.primary, 0.4),
									},
								})}
							/>
						))}
					</Stack>
					<Typography
						variant='caption'
						className='qa-latin'
						dir='ltr'
						aria-live='polite'
						sx={{ color: "text.secondary", fontWeight: 600, letterSpacing: 1 }}
					>
						{current + 1} / {count}
					</Typography>
				</Stack>

				<NavButton
					label='الصورة التالية'
					disabled={current === count - 1}
					onClick={() => go(current + 1)}
				>
					<ChevronLeftRoundedIcon />
				</NavButton>
			</Stack>
		</Box>
	);
}

function NavButton({
	label,
	disabled,
	onClick,
	children,
}: {
	label: string;
	disabled: boolean;
	onClick: () => void;
	children: React.ReactNode;
}) {
	return (
		<IconButton
			aria-label={label}
			disabled={disabled}
			onClick={onClick}
			sx={(theme) => ({
				width: 46,
				height: 46,
				color: "text.primary",
				border: `1px solid ${theme.tokens.colors.border}`,
				backgroundColor: alpha(theme.tokens.colors.surface, 0.7),
				backdropFilter: "blur(8px)",
				boxShadow: `0 8px 20px -12px ${alpha(theme.tokens.colors.violet, 0.6)}`,
				transition:
					"transform 250ms cubic-bezier(0.22, 1, 0.36, 1), background 250ms, color 250ms",
				"&:hover": {
					color: "common.white",
					background: theme.tokens.gradients.primary,
					transform: "translateY(-2px)",
				},
				"&.Mui-disabled": { opacity: 0.35 },
			})}
		>
			{children}
		</IconButton>
	);
}
