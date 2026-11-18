"use client";
import { signInWithGoogle } from "@/components/Auth/GoogleSigninDialog";
import AppDialog from "@/components/ui/AppDialog";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import GoogleIcon from "@mui/icons-material/Google";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, Stack, Typography } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, type ComponentType, type KeyboardEvent } from "react";
import {
	displayPhone,
	AllUnitsScene,
	ClassMappingScene,
	PhoneScene,
} from "./scenes";
import useWhatsNew from "./useWhatsNew";

type Slide = {
	Scene: ComponentType<{ number?: string }>;
	title: string;
	text: string;
};

/** The three-step announcement: overview, labels, then subscription contact. */
const phoneSlide = (number: string | null): Slide => ({
	Scene: PhoneScene,
	title: "للاشتراك بالوحدات",
	text: number
		? `للاشتراك تواصلوا معنا عبر واتساب على الرقم التالي: ${displayPhone(number)}.`
		: "للاشتراك بالوحدات، تواصلوا معنا عبر واتساب.",
});

const unitSlides = (number: string | null): readonly Slide[] => [
	{
		Scene: AllUnitsScene,
		title: "3 وحدات مدفوعة في المنصة",
		text: "الوحدة الأولى والثانية والثالثة متاحة للطلاب بالاشتراك.",
	},
	{
		Scene: ClassMappingScene,
		title: "توزيع الوحدات حسب التوجيهي",
		text: "الوحدة الأولى لصف توجيهي 2009، والوحدتان الثانية والثالثة لصف توجيهي 2008. يمكنك الاشتراك في أي وحدة؛ فهي لنفس المسار، والاختلاف في التسمية فقط.",
	},
	phoneSlide(number),
];

// RTL: moving forward brings the next slide in from the left.
const slideVariants = {
	enter: (dir: number) => ({ opacity: 0, x: -48 * dir }),
	center: { opacity: 1, x: 0 },
	exit: (dir: number) => ({ opacity: 0, x: 48 * dir }),
};

/** One-time tour of the new student features, shown on the public pages. */
export default function WhatsNewDialog({
	whatsAppNumber,
}: {
	whatsAppNumber: string | null;
}) {
	const { open, close } = useWhatsNew();
	const { data: session } = useSession();
	const [[index, direction], setPage] = useState([0, 1]);
	const slides = unitSlides(whatsAppNumber);
	const last = index === slides.length - 1;
	const whatsappUrl = whatsAppNumber
		? `https://wa.me/${whatsAppNumber.replace(/\D/g, "")}`
		: null;
	const { Scene, title, text } = slides[index];

	const go = (to: number) => {
		if (to < 0 || to >= slides.length || to === index) return;
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
			onClose={() => {
				if (last) finish();
			}}
			title='ما الجديد في المنصة؟'
			maxWidth='sm'
			fullScreenOnMobile={false}
			busy={!last}
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
						transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
						role='group'
						aria-roledescription='شريحة'
						aria-label={`${index + 1} من ${slides.length}: ${title}`}
					>
						<Scene number={whatsAppNumber ?? ""} />
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
							{last && whatsappUrl ? (
								<Button
									component='a'
									href={whatsappUrl}
									target='_blank'
									rel='noopener noreferrer'
									variant='contained'
									startIcon={<WhatsAppIcon />}
									sx={{
										mt: 2,
										px: 2.5,
										borderRadius: 999,
										fontWeight: 800,
										background:
											"linear-gradient(135deg, #075e54 0%, #128c7e 100%)",
										boxShadow: "0 8px 18px rgba(18, 140, 126, 0.28)",
										"&:hover": {
											background:
												"linear-gradient(135deg, #064c44 0%, #0d6f64 100%)",
										},
									}}
								>
									راسلنا على واتساب
								</Button>
							) : null}
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
						{last ? (
							<Button variant='text' color='inherit' onClick={() => finish()}>
								تخطّي
							</Button>
						) : index > 0 ? (
							<Button
								variant='text'
								startIcon={<ArrowForwardRoundedIcon />}
								onClick={() => go(index - 1)}
							>
								السابق
							</Button>
						) : null}
					</Box>

					<Stack
						direction='row'
						gap={0.75}
						role='progressbar'
						aria-label='تقدّم الإعلان'
						aria-valuemin={1}
						aria-valuemax={slides.length}
						aria-valuenow={index + 1}
					>
						{slides.map((slide, i) => (
							<Box
								key={slide.title}
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
							<Button variant='contained' onClick={() => finish()}>
								يلّا نبدأ
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
