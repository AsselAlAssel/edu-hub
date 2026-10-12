"use client";
import { signInWithGoogle } from "@/components/Auth/GoogleSigninDialog";
import AppDialog from "@/components/ui/AppDialog";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GoogleIcon from "@mui/icons-material/Google";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import { Box, Button, ButtonBase, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, type KeyboardEvent } from "react";
import {
	CompleteScene,
	ProgressScene,
	ResumeScene,
	SigninScene,
} from "./scenes";
import useWhatsNew from "./useWhatsNew";

const SLIDES = [
	{
		Scene: SigninScene,
		title: "سجّل دخولك بنقرة واحدة",
		text: "استخدم حسابك في Google، بلا كلمات مرور ولا نماذج طويلة، ليُحفظ تقدّمك تلقائيًا.",
	},
	{
		Scene: CompleteScene,
		title: "كل فيديو تُنهيه يُحفظ تلقائيًا",
		text: "عند مشاهدة 90٪ من الفيديو يُعلَّم مكتملًا، ويمكنك تعليمه بنفسك من الدائرة بجانب عنوانه.",
	},
	{
		Scene: ResumeScene,
		title: "أكمِل من حيث توقفت",
		text: "نتذكّر الثانية التي توقفت عندها، فيبدأ الفيديو منها في المرة القادمة.",
	},
	{
		Scene: ProgressScene,
		title: "تابع تقدّمك في كل صف",
		text: "صفحة «تقدّمي» تعرض نسبة إنجازك في كل صف، والفيديوهات التي لم تُكملها بعد.",
	},
] as const;

// RTL: moving forward brings the next slide in from the left.
const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, x: -48 * dir }),
	center: { opacity: 1, x: 0 },
	exit: (dir: number) => ({ opacity: 0, x: 48 * dir }),
};

/** One-time tour of the new student features, shown on the public pages. */
export default function WhatsNewDialog() {
	const { open, close } = useWhatsNew();
	const { data: session } = useSession();
	const [[index, direction], setPage] = useState([0, 1]);
	const last = index === SLIDES.length - 1;
	const { Scene, title, text } = SLIDES[index];

	const go = (to: number) => {
		if (to < 0 || to >= SLIDES.length || to === index) return;
		setPage([to, to > index ? 1 : -1]);
	};

	// Arrow keys follow the reading direction: ← next, → previous.
	const onKeyDown = (event: KeyboardEvent) => {
		if (event.key === "ArrowLeft") go(index + 1);
		if (event.key === "ArrowRight") go(index - 1);
	};

	const finish = (then?: () => void) => {
		close();
		then?.();
	};

	return (
		<AppDialog
			open={open}
			onClose={() => finish()}
			title='ما الجديد في المنصة؟'
			maxWidth='sm'
			fullScreenOnMobile={false}
		>
			{/* overflowX: the sliding slide must not flash a horizontal scrollbar. */}
			<Box onKeyDown={onKeyDown} sx={{ pb: 1, overflowX: "hidden" }}>
				<AnimatePresence mode='wait' custom={direction} initial={false}>
					<motion.div
						key={index}
						custom={direction}
						variants={slideVariants}
						initial='enter'
						animate='center'
						exit='exit'
						transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
						role='group'
						aria-roledescription='شريحة'
						aria-label={`${index + 1} من ${SLIDES.length}: ${title}`}
					>
						<Scene />
						<Box sx={{ mt: 2.5, minHeight: { xs: 104, sm: 92 } }}>
							<Typography
								variant='h5'
								component='h3'
								sx={{ fontWeight: 800, mb: 1 }}
							>
								{title}
							</Typography>
							<Typography sx={{ color: "text.secondary", lineHeight: 1.8 }}>
								{text}
							</Typography>
						</Box>
					</motion.div>
				</AnimatePresence>

				{/* Footer: back · dots · next/finish (the reading order in RTL). */}
				<Stack
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					gap={1}
					sx={{ mt: 2.5 }}
				>
					<Box sx={{ minWidth: 96 }}>
						{index > 0 ? (
							<Button
								variant='text'
								startIcon={<ArrowForwardRoundedIcon />}
								onClick={() => go(index - 1)}
							>
								السابق
							</Button>
						) : (
							<Button variant='text' color='inherit' onClick={() => finish()}>
								تخطّي
							</Button>
						)}
					</Box>

					<Stack direction='row' gap={0.75} aria-label='الشرائح'>
						{SLIDES.map((slide, i) => (
							<ButtonBase
								key={slide.title}
								onClick={() => go(i)}
								aria-label={`الشريحة ${i + 1}: ${slide.title}`}
								aria-current={i === index ? "step" : undefined}
								sx={(theme) => ({
									width: i === index ? 22 : 8,
									height: 8,
									borderRadius: 4,
									backgroundColor:
										i === index
											? theme.palette.primary.main
											: theme.tokens.colors.border,
									transition: theme.transitions.create([
										"width",
										"background-color",
									]),
								})}
							/>
						))}
					</Stack>

					<Box
						sx={{ minWidth: 96, display: "flex", justifyContent: "flex-end" }}
					>
						{!last ? (
							<Button
								variant='contained'
								endIcon={<ArrowBackRoundedIcon />}
								onClick={() => go(index + 1)}
							>
								التالي
							</Button>
						) : session?.user ? (
							<Button
								variant='contained'
								component={Link}
								href='/progress'
								startIcon={<InsightsOutlinedIcon />}
								onClick={() => finish()}
							>
								اعرض تقدّمي
							</Button>
						) : (
							<Button
								variant='contained'
								startIcon={<GoogleIcon />}
								onClick={() => finish(signInWithGoogle)}
							>
								سجّل دخولك
							</Button>
						)}
					</Box>
				</Stack>
			</Box>
		</AppDialog>
	);
}
