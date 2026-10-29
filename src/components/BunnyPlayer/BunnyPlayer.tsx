"use client";
import {
	GoogleLogo,
	signInWithGoogle,
} from "@/components/Auth/GoogleSigninDialog";
import AppDialog from "@/components/ui/AppDialog";
import { ErrorState, LoadingState } from "@/components/ui/States";
import { useCloseOnBack } from "@/components/VideoPlayer/VideoPlayer";
import FullscreenRoundedIcon from "@mui/icons-material/FullscreenRounded";
import { Box, Button, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import useWatermarkGuard from "./useWatermarkGuard";

type Playback =
	| { status: "loading" }
	| { status: "error"; message: string; code?: number }
	| { status: "ready"; url: string; watermark: string };

const ERRORS: Record<number, string> = {
	401: "سجّل الدخول لمشاهدة هذا الفيديو.",
	403: "هذا الفيديو للمشتركين في الوحدة.",
	404: "الفيديو غير موجود.",
};

/**
 * Paid-unit (Bunny Stream) player in the same dialog as YouTube videos. The
 * signed URL and the watermark text come from /api/video/[id]/playback, which
 * checks the student's access on every open.
 */
export default function BunnyPlayer({
	open,
	handleClose,
	videoId,
	title = "مشغّل الفيديو",
}: {
	open: boolean;
	handleClose: () => void;
	/** Database id of the video. */
	videoId: string;
	title?: string;
}) {
	const close = useCloseOnBack(open, handleClose);
	const [playback, setPlayback] = useState<Playback>({ status: "loading" });
	const [attempt, setAttempt] = useState(0);
	const boxRef = useRef<HTMLDivElement>(null);
	const markRef = useRef<HTMLDivElement>(null);
	const ready = open && playback.status === "ready";
	const tampered = useWatermarkGuard(
		boxRef,
		markRef,
		playback.status === "ready" ? playback.watermark : "",
		ready
	);

	// One request per open (or per retry click): no automatic retries.
	useEffect(() => {
		if (!open || !videoId) return;
		let cancelled = false;
		fetch(`/api/video/${videoId}/playback`, { cache: "no-store" })
			.then(async (res) => {
				if (cancelled) return;
				if (!res.ok) {
					setPlayback({
						status: "error",
						message: ERRORS[res.status] ?? "تعذّر تشغيل الفيديو.",
						code: res.status,
					});
					return;
				}
				const { url, watermark } = await res.json();
				if (!cancelled) setPlayback({ status: "ready", url, watermark });
			})
			.catch(() => {
				if (!cancelled) {
					setPlayback({ status: "error", message: "تعذّر الاتصال بالسيرفر." });
				}
			});
		return () => {
			cancelled = true;
			// Closing (or retrying) never shows the previous video's expired URL.
			setPlayback({ status: "loading" });
		};
	}, [open, videoId, attempt]);

	let content;
	if (tampered) {
		content = (
			<ErrorState
				title='تم إيقاف الفيديو'
				description='تم التلاعب بالعلامة المائية. حدّث الصفحة للمتابعة.'
			/>
		);
	} else if (playback.status === "loading") {
		content = <LoadingState label='جارٍ تجهيز المشغّل…' />;
	} else if (playback.status === "error") {
		content = (
			<ErrorState
				title='تعذّر تشغيل الفيديو'
				description={playback.message}
				action={
					playback.code === 401 ? (
						<Button
							variant='outlined'
							startIcon={<GoogleLogo />}
							onClick={signInWithGoogle}
						>
							تسجيل الدخول
						</Button>
					) : (
						<Button variant='outlined' onClick={() => setAttempt((n) => n + 1)}>
							إعادة المحاولة
						</Button>
					)
				}
			/>
		);
	} else if (open) {
		content = (
			<Stack spacing={1.5}>
				<Box
					ref={boxRef}
					sx={(theme) => ({
						position: "relative",
						aspectRatio: "16 / 9",
						maxWidth: "calc((100dvh - 200px) * 16 / 9)",
						width: "100%",
						mx: "auto",
						borderRadius: `${theme.tokens.radii.md}px`,
						overflow: "hidden",
						backgroundColor: theme.palette.common.black,
						"&:fullscreen": { maxWidth: "none", borderRadius: 0 },
					})}
				>
					{/* No allowFullScreen: the iframe alone would go fullscreen and leave
					    the watermark behind. The box goes fullscreen instead. */}
					<iframe
						src={playback.url}
						title={title}
						allow='accelerometer; gyroscope; autoplay; encrypted-media'
						style={{
							border: 0,
							position: "absolute",
							inset: 0,
							width: "100%",
							height: "100%",
						}}
					/>
					<Box
						ref={markRef}
						aria-hidden
						sx={{
							position: "absolute",
							// Fixed in the top right corner (inline start of the RTL page;
							// a plain `right` would be flipped by the RTL style plugin).
							top: 8,
							insetInlineStart: 8,
							zIndex: 2,
							pointerEvents: "none",
							userSelect: "none",
							color: "rgba(255,255,255,0.55)",
							textShadow: "0 0 3px rgba(0,0,0,0.8)",
							fontSize: { xs: 11, md: 14 },
							fontWeight: 600,
							direction: "ltr",
							whiteSpace: "nowrap",
						}}
					>
						{playback.watermark}
					</Box>
				</Box>
				<Button
					size='small'
					startIcon={<FullscreenRoundedIcon />}
					onClick={() => void boxRef.current?.requestFullscreen?.()}
					sx={{ alignSelf: "flex-start" }}
				>
					ملء الشاشة
				</Button>
			</Stack>
		);
	}

	return (
		<AppDialog
			open={open}
			onClose={close}
			title={title}
			maxWidth='md'
			fullScreenOnMobile={false}
		>
			{/* Unmounted on close, which stops playback. */}
			{open ? content : null}
		</AppDialog>
	);
}
