"use client";
import { signInWithGoogle } from "@/components/Auth/GoogleSigninDialog";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { cardGridSx } from "@/components/ui/Skeletons";
import { EmptyState, LoadingState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import useProgress, {
	completedIn,
	formatTime,
	inProgress,
	watchUrl,
	type VideoProgress,
} from "@/hooks/useProgress";
import type { ClassWithMeta } from "@/libs/class";
import { youtubeThumbnail } from "@/scenes/ResourcesPage/components/VideoCard";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import GoogleIcon from "@mui/icons-material/Google";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box, Button, LinearProgress, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

const RECENT_DONE = 6;

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<Box component='section' sx={{ mb: { xs: 5, md: 6 } }}>
			<Typography
				variant='h4'
				component='h2'
				sx={{ fontSize: { xs: "1.25rem", md: "1.4375rem" }, mb: 2.5 }}
			>
				{title}
			</Typography>
			{children}
		</Box>
	);
}

/** A video to resume: thumbnail, name, resume time. */
function ResumeCard({ item }: { item: VideoProgress }) {
	return (
		<Surface interactive sx={{ height: "100%", overflow: "hidden" }}>
			<Box
				component={Link}
				href={watchUrl(item)}
				sx={{ display: "block", color: "inherit", textDecoration: "none" }}
			>
				<Box
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "16 / 9",
						backgroundColor: theme.tokens.colors.surfaceSecondary,
					})}
				>
					{item.youtubeId ? (
						<Image
							src={youtubeThumbnail({
								videoId: item.youtubeId,
								thumbnailUrl: "",
							})}
							unoptimized
							alt=''
							fill
							sizes='(max-width: 600px) 100vw, 300px'
							style={{ objectFit: "cover" }}
						/>
					) : null}
					<Box
						aria-hidden
						sx={{
							position: "absolute",
							inset: 0,
							display: "grid",
							placeItems: "center",
							color: "common.white",
							backgroundColor: "rgba(0,0,0,0.3)",
							"& svg": { fontSize: 40 },
						}}
					>
						<PlayArrowRoundedIcon />
					</Box>
				</Box>
				<Box sx={{ p: 1.75 }}>
					<Typography
						variant='caption'
						sx={{ color: "primary.main", fontWeight: 700 }}
					>
						تابع من {formatTime(item.position)}
					</Typography>
					<Typography component='h3' sx={{ fontWeight: 600, lineHeight: 1.6 }}>
						{item.name}
					</Typography>
				</Box>
			</Box>
		</Surface>
	);
}

/** The signed-in student's progress: resume, per class, recently finished. */
export default function ProgressPage({
	classes,
}: {
	classes: ClassWithMeta[];
}) {
	const { signedIn, ready, items } = useProgress();

	if (!ready) return <LoadingState label='جارٍ تحميل تقدّمك…' />;

	if (!signedIn) {
		return (
			<PageShell width='narrow'>
				<EmptyState
					icon={<InsightsOutlinedIcon />}
					title='سجّل دخولك لتشوف تقدّمك'
					description='احفظ الفيديوهات اللي أنهيتها وكمّل كل فيديو من حيث توقفت.'
					action={
						<Button
							variant='contained'
							startIcon={<GoogleIcon />}
							onClick={signInWithGoogle}
						>
							الدخول بحساب Google
						</Button>
					}
				/>
			</PageShell>
		);
	}

	const total = classes.reduce((sum, c) => sum + (c._count?.videos ?? 0), 0);
	const done = classes.reduce((sum, c) => sum + completedIn(items, c.id), 0);
	const resume = inProgress(items);
	const recentDone = items
		.filter((item) => item.completed)
		.slice(0, RECENT_DONE); // already newest first

	return (
		<PageShell>
			<PageHeader
				eyebrow='حسابي'
				title='تقدّمي'
				description={
					total ? `أنهيت ${done} من ${total} فيديو على المنصة.` : undefined
				}
				actions={
					total ? (
						<Box sx={{ width: { xs: "100%", md: 260 } }}>
							<Typography
								className='qa-latin'
								sx={{ fontSize: "2rem", fontWeight: 800, lineHeight: 1.2 }}
							>
								{Math.round((done / total) * 100)}%
							</Typography>
							<LinearProgress
								variant='determinate'
								value={(done / total) * 100}
								aria-label={`أنهيت ${done} من ${total} فيديو`}
								sx={{ height: 10, borderRadius: 5, mt: 1 }}
							/>
						</Box>
					) : undefined
				}
			/>

			{!items.length ? (
				<EmptyState
					icon={<InsightsOutlinedIcon />}
					title='لسا ما بلّشت'
					description='افتح أي فيديو، وتقدّمك رح يبيّن هون.'
					action={
						<Button component={Link} href='/classes' variant='contained'>
							تصفّح الصفوف
						</Button>
					}
				/>
			) : (
				<>
					{resume.length ? (
						<Section title='تابع المشاهدة'>
							<Box
								component='ul'
								sx={{ ...cardGridSx, listStyle: "none", m: 0, p: 0 }}
							>
								{resume.map((item) => (
									<li key={item.videoId}>
										<ResumeCard item={item} />
									</li>
								))}
							</Box>
						</Section>
					) : null}

					<Section title='صفوفي'>
						<Stack
							component='ul'
							spacing={1.5}
							sx={{ listStyle: "none", m: 0, p: 0 }}
						>
							{classes
								.filter((c) => (c._count?.videos ?? 0) > 0)
								.map((c) => {
									const classTotal = c._count?.videos ?? 0;
									const classDone = completedIn(items, c.id);
									const root = c.folders?.[0]?.id;
									return (
										<Surface component='li' key={c.id} sx={{ p: 2 }}>
											<Stack
												direction='row'
												justifyContent='space-between'
												alignItems='baseline'
												gap={2}
												sx={{ mb: 1 }}
											>
												{root ? (
													<Box
														component={Link}
														href={`/class/${c.id}/folder/${root}`}
														sx={{
															fontWeight: 700,
															color: "text.primary",
															textDecoration: "none",
															"&:hover": { color: "primary.main" },
														}}
													>
														{c.name}
													</Box>
												) : (
													<Typography sx={{ fontWeight: 700 }}>
														{c.name}
													</Typography>
												)}
												<Typography
													variant='body2'
													sx={{ color: "text.secondary", flexShrink: 0 }}
												>
													{classDone} من {classTotal}
												</Typography>
											</Stack>
											<LinearProgress
												variant='determinate'
												value={(classDone / classTotal) * 100}
												aria-label={`أنهيت ${classDone} من ${classTotal} فيديو في ${c.name}`}
												sx={{ height: 8, borderRadius: 4 }}
											/>
										</Surface>
									);
								})}
						</Stack>
					</Section>

					{recentDone.length ? (
						<Section title='أنهيت مؤخرًا'>
							<Stack
								component='ul'
								spacing={1}
								sx={{ listStyle: "none", m: 0, p: 0 }}
							>
								{recentDone.map((item) => (
									<Stack
										component='li'
										key={item.videoId}
										direction='row'
										alignItems='center'
										gap={1.25}
									>
										<CheckCircleRoundedIcon
											aria-hidden
											sx={{ color: "success.main", fontSize: 20 }}
										/>
										<Box
											component={Link}
											href={watchUrl(item)}
											sx={{
												color: "text.primary",
												textDecoration: "none",
												"&:hover": { color: "primary.main" },
											}}
										>
											{item.name}
										</Box>
									</Stack>
								))}
							</Stack>
						</Section>
					) : null}
				</>
			)}
		</PageShell>
	);
}
