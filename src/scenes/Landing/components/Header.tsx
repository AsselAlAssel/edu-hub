"use client";
import PageContainer from "@/components/PageContainer";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { Box, Button, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

type HeroProps = {
	headerTitle?: string;
	headerSubtitle?: string | null;
	headerImage?: string | null;
	isVideoExist?: boolean;
	/** CMS preview: renders an h2 and skips LCP image priority. */
	preview?: boolean;
};

const EQUATIONS = ["F = ma", "E = mc²", "v = λf"];

/** Landing hero: headline, CTAs and the CMS image inside an orbit frame. */
export default function Header({
	headerTitle,
	headerSubtitle,
	headerImage,
	preview = false,
}: HeroProps) {
	return (
		<Box
			sx={(theme) => {
				const { colors } = theme.tokens;
				return {
					position: "relative",
					overflow: "hidden",
					isolation: "isolate",
					py: { xs: 7, md: 11 },
					// Aurora wash: one cyan and one violet radial — static, low alpha.
					backgroundImage: `radial-gradient(60% 55% at 85% 0%, ${alpha(colors.cyan, 0.14)} 0%, transparent 70%), radial-gradient(45% 50% at 5% 100%, ${alpha(colors.violet, 0.12)} 0%, transparent 70%)`,
					"&::before": {
						content: '""',
						position: "absolute",
						inset: 0,
						zIndex: -1,
						backgroundImage: `linear-gradient(${colors.border} 1px, transparent 1px), linear-gradient(90deg, ${colors.border} 1px, transparent 1px)`,
						backgroundSize: "56px 56px",
						maskImage:
							"radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%)",
						WebkitMaskImage:
							"radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%)",
						opacity: 0.6,
					},
				};
			}}
		>
			<PageContainer>
				<Box
					sx={{
						display: "grid",
						alignItems: "center",
						gap: { xs: 6, md: 8 },
						gridTemplateColumns: {
							xs: "1fr",
							md: headerImage ? "1.1fr 0.9fr" : "1fr",
						},
					}}
				>
					<Stack
						spacing={3}
						alignItems={{ xs: "center", md: "flex-start" }}
						textAlign={{ xs: "center", md: "start" }}
						sx={{
							"@media (prefers-reduced-motion: no-preference)": {
								animation: "qaHeroIn 600ms cubic-bezier(0.22, 1, 0.36, 1) both",
							},
							"@keyframes qaHeroIn": {
								from: { opacity: 0, transform: "translateY(12px)" },
								to: { opacity: 1, transform: "none" },
							},
						}}
					>
						<Box
							sx={(theme) => ({
								display: "inline-flex",
								alignItems: "center",
								gap: 1,
								px: 1.75,
								py: 0.5,
								borderRadius: `${theme.tokens.radii.full}px`,
								border: `1px solid ${theme.tokens.colors.borderStrong}`,
								backgroundColor: alpha(theme.palette.primary.main, 0.08),
								color: "primary.main",
								fontWeight: 700,
								fontSize: "0.875rem",
							})}
						>
							<Box
								aria-hidden
								sx={{
									width: 6,
									height: 6,
									borderRadius: "50%",
									bgcolor: "primary.main",
								}}
							/>
							منصة الأستاذ محمد صبح لتعليم الفيزياء
						</Box>

						<Typography
							variant='h1'
							component={preview ? "h2" : "h1"}
							sx={{
								fontSize: { xs: "2.25rem", sm: "2.875rem", md: "3.5rem" },
								lineHeight: 1.2,
								maxWidth: 640,
								"& .qa-accent": { color: "primary.main" },
							}}
						>
							{headerTitle || (
								<>
									اكتشف عالم <span className='qa-accent'>الفيزياء</span> بطريقة
									واضحة
								</>
							)}
						</Typography>

						{headerSubtitle ? (
							<Typography
								variant='subtitle1'
								component='p'
								sx={{
									color: "text.secondary",
									maxWidth: 560,
									fontSize: { md: "1.1875rem" },
								}}
							>
								{headerSubtitle}
							</Typography>
						) : null}

						<Stack
							direction={{ xs: "column", sm: "row" }}
							gap={1.5}
							sx={{ width: { xs: "100%", sm: "auto" }, pt: 1 }}
						>
							<Button
								component={Link}
								href='/classes'
								size='large'
								endIcon={<ArrowBackRoundedIcon />}
							>
								تصفّح الصفوف
							</Button>
							<Button
								component={Link}
								href='/#about'
								size='large'
								variant='outlined'
							>
								تعرّف على المنصة
							</Button>
						</Stack>
					</Stack>

					{headerImage ? (
						<Box
							sx={{
								position: "relative",
								maxWidth: 520,
								width: "100%",
								mx: "auto",
							}}
						>
							{/* Orbit rings: static decoration, hidden from assistive tech. */}
							<Box
								aria-hidden
								sx={(theme) => ({
									position: "absolute",
									inset: "-8%",
									borderRadius: "50%",
									border: `1px dashed ${theme.tokens.colors.borderStrong}`,
									transform: "rotate(-12deg) scaleY(0.82)",
									pointerEvents: "none",
								})}
							/>
							<Box
								sx={(theme) => ({
									position: "relative",
									aspectRatio: "5 / 4",
									borderRadius: `${theme.tokens.radii.xl}px`,
									overflow: "hidden",
									border: `1px solid ${theme.tokens.colors.border}`,
									boxShadow: theme.tokens.shadows.medium,
									backgroundColor: theme.tokens.colors.surfaceSecondary,
								})}
							>
								<Image
									src={headerImage}
									alt='الأستاذ محمد صبح — شروحات الفيزياء'
									fill
									priority={!preview}
									sizes='(max-width: 900px) 92vw, 520px'
									style={{ objectFit: "cover" }}
								/>
							</Box>
							{EQUATIONS.map((equation, index) => (
								<Box
									key={equation}
									aria-hidden
									sx={(theme) => ({
										display: {
											xs: index === 2 ? "none" : "block",
											sm: "block",
										},
										position: "absolute",
										...[
											{ top: "8%", insetInlineStart: "-6%" },
											{ bottom: "10%", insetInlineEnd: "-5%" },
											{ bottom: "-4%", insetInlineStart: "18%" },
										][index],
										px: 1.5,
										py: 0.75,
										borderRadius: `${theme.tokens.radii.sm}px`,
										backgroundColor: theme.tokens.colors.surfaceElevated,
										border: `1px solid ${theme.tokens.colors.border}`,
										boxShadow: theme.tokens.shadows.medium,
										fontFamily:
											"ui-monospace, SFMono-Regular, Menlo, monospace",
										fontWeight: 700,
										fontSize: "0.875rem",
										color: index === 1 ? "secondary.main" : "primary.main",
										direction: "ltr",
									})}
								>
									{equation}
								</Box>
							))}
						</Box>
					) : null}
				</Box>
			</PageContainer>
		</Box>
	);
}
