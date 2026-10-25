"use client";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { ErrorState, LoadingState } from "@/components/ui/States";
import Surface from "@/components/ui/Surface";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

type Playback =
	| { status: "loading" }
	| { status: "error"; httpStatus: number | null; message: string }
	| { status: "ready"; url: string; expires: number };

const ERRORS: Record<number, string> = {
	401: "انتهت جلستك، سجّل الدخول من جديد.",
	403: "هذا الحساب غير مسموح له بصفحة الاختبار.",
	500: "تعذّر تجهيز رابط التشغيل (إعدادات Bunny ناقصة أو خطأ في السيرفر).",
};

/** Only the first characters of the token, never the full signed URL. */
const maskedToken = (url: string) =>
	`${new URL(url).searchParams.get("token")?.slice(0, 8) ?? ""}…`;

/** Transparent text (opacity or colour alpha) counts as hidden. */
const isVisible = (el: HTMLElement) => {
	const s = getComputedStyle(el);
	const alpha = Number(s.color.match(/rgba?\([^)]*,\s*([\d.]+)\)/)?.[1] ?? 1);
	return (
		s.display !== "none" &&
		s.visibility === "visible" &&
		Number(s.opacity) >= 0.2 &&
		alpha >= 0.2 &&
		el.offsetWidth > 0 &&
		el.offsetHeight > 0
	);
};

/**
 * Stops playback when the watermark is removed, emptied, hidden or pushed
 * out of the player.
 * ponytail: client-side only; someone who disables JS in DevTools can still
 * beat it. It deters screen-recording leaks, it does not stop downloads (DRM does).
 */
function useWatermarkGuard(
	box: React.RefObject<HTMLDivElement | null>,
	mark: React.RefObject<HTMLDivElement | null>,
	text: string,
	active: boolean
) {
	const [tampered, setTampered] = useState(false);
	useEffect(() => {
		if (!active || !box.current) return;
		const check = () => {
			const b = box.current;
			const m = mark.current;
			if (
				!b ||
				!m ||
				!b.contains(m) ||
				m.textContent !== text ||
				!isVisible(m)
			) {
				setTampered(true);
				return;
			}
			const br = b.getBoundingClientRect();
			const mr = m.getBoundingClientRect();
			const inside =
				mr.left >= br.left - 1 &&
				mr.right <= br.right + 1 &&
				mr.top >= br.top - 1 &&
				mr.bottom <= br.bottom + 1;
			if (!inside) setTampered(true);
		};
		const observer = new MutationObserver(check);
		observer.observe(box.current, {
			subtree: true,
			childList: true,
			attributes: true,
			characterData: true,
		});
		// Catches CSS injected elsewhere (stylesheets do not trigger the observer).
		const id = setInterval(check, 1000);
		return () => {
			observer.disconnect();
			clearInterval(id);
		};
	}, [box, mark, text, active]);
	return tampered;
}

export default function BunnyTestPlayer({ watermark }: { watermark: string }) {
	const [playback, setPlayback] = useState<Playback>({ status: "loading" });
	const [lastStatus, setLastStatus] = useState<number | null>(null);
	const [iframeKey, setIframeKey] = useState(0);
	const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));
	const boxRef = useRef<HTMLDivElement>(null);
	const markRef = useRef<HTMLDivElement>(null);
	const [markPos, setMarkPos] = useState({ top: 8, left: 8 });
	const tampered = useWatermarkGuard(
		boxRef,
		markRef,
		watermark,
		playback.status === "ready"
	);

	// Moves every few seconds so it cannot be cropped or blurred in one spot.
	useEffect(() => {
		const id = setInterval(
			() =>
				setMarkPos({
					top: 3 + Math.random() * 94,
					left: 3 + Math.random() * 94,
				}),
			4000
		);
		return () => clearInterval(id);
	}, []);

	// One request per click: no automatic retries, so no request loops.
	const requestUrl = useCallback(async () => {
		setPlayback({ status: "loading" });
		try {
			const res = await fetch("/api/bunny-test/playback", {
				cache: "no-store",
			});
			setLastStatus(res.status);
			if (!res.ok) {
				setPlayback({
					status: "error",
					httpStatus: res.status,
					message: ERRORS[res.status] ?? "فشل طلب رابط التشغيل.",
				});
				return;
			}
			const { url, expires } = await res.json();
			setPlayback({ status: "ready", url, expires });
			setIframeKey((k) => k + 1);
		} catch {
			setLastStatus(null);
			setPlayback({
				status: "error",
				httpStatus: null,
				message: "تعذّر الاتصال بالسيرفر.",
			});
		}
	}, []);

	useEffect(() => {
		void requestUrl();
	}, [requestUrl]);

	useEffect(() => {
		const id = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
		return () => clearInterval(id);
	}, []);

	const secondsLeft =
		playback.status === "ready" ? playback.expires - now : null;
	const expired = secondsLeft !== null && secondsLeft <= 0;

	return (
		<PageShell>
			<PageHeader
				eyebrow='صفحة اختبار مؤقتة'
				title='Bunny Stream Test'
				description='تجربة تقنية لتشغيل فيديو محمي برابط موقّع. ليست جزءًا من الكورسات.'
			/>

			<Surface sx={{ p: { xs: 1.5, md: 2 }, mb: 3 }}>
				{playback.status === "loading" && (
					<LoadingState label='جارٍ تجهيز المشغّل…' />
				)}
				{playback.status === "error" && (
					<ErrorState
						title='تعذّر تشغيل الفيديو'
						description={playback.message}
						action={
							<Button variant='contained' onClick={() => void requestUrl()}>
								إعادة المحاولة
							</Button>
						}
					/>
				)}
				{tampered && (
					<ErrorState
						title='تم إيقاف الفيديو'
						description='تم التلاعب بالعلامة المائية. حدّث الصفحة للمتابعة.'
					/>
				)}
				{playback.status === "ready" && !tampered && (
					<Box
						ref={boxRef}
						sx={{
							position: "relative",
							pt: "56.25%",
							borderRadius: 2,
							overflow: "hidden",
							bgcolor: "common.black",
							"&:fullscreen": { pt: 0, borderRadius: 0 },
						}}
					>
						{/* No allowFullScreen: the iframe alone would go fullscreen
						    and leave the watermark behind. The box goes fullscreen instead. */}
						<iframe
							key={iframeKey}
							src={playback.url}
							title='Bunny Stream test video'
							loading='lazy'
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
								top: `${markPos.top}%`,
								left: `${markPos.left}%`,
								// Shifting by the same % keeps the whole text inside the box
								// at any position and screen size.
								transform: `translate(-${markPos.left}%, -${markPos.top}%)`,
								zIndex: 2,
								pointerEvents: "none",
								userSelect: "none",
								color: "rgba(255,255,255,0.55)",
								textShadow: "0 0 3px rgba(0,0,0,0.8)",
								fontSize: { xs: 11, md: 14 },
								fontWeight: 600,
								direction: "ltr",
								whiteSpace: "nowrap",
								transition:
									"top 1.5s ease, left 1.5s ease, transform 1.5s ease",
							}}
						>
							{watermark}
						</Box>
					</Box>
				)}
			</Surface>

			{expired && (
				<Alert severity='warning' sx={{ mb: 3 }}>
					انتهت صلاحية رابط التشغيل. إذا كان الفيديو يعمل فهو حُمّل قبل
					الانتهاء؛ اطلب رابطًا جديدًا لإعادة التحميل.
				</Alert>
			)}

			<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} mb={3}>
				<Button
					variant='contained'
					onClick={() => void requestUrl()}
					disabled={playback.status === "loading"}
				>
					طلب رابط جديد
				</Button>
				<Button
					variant='outlined'
					onClick={() => setIframeKey((k) => k + 1)}
					disabled={playback.status !== "ready"}
				>
					إعادة تحميل المشغّل بنفس الرابط
				</Button>
				<Button
					variant='outlined'
					onClick={() => void boxRef.current?.requestFullscreen?.()}
					disabled={playback.status !== "ready" || tampered}
				>
					ملء الشاشة
				</Button>
			</Stack>

			<Surface sx={{ p: 2 }}>
				<Typography variant='h6' component='h2' mb={1}>
					معلومات تشخيصية
				</Typography>
				<Box
					component='dl'
					sx={{
						display: "grid",
						gridTemplateColumns: "auto 1fr",
						gap: 1,
						m: 0,
						"& dd": { m: 0, direction: "ltr", textAlign: "start" },
					}}
				>
					<dt>المصادقة</dt>
					<dd>
						{playback.status === "error" && playback.httpStatus === 401
							? "غير مسجّل"
							: "مسجّل (تحقّق السيرفر)"}
					</dd>
					<dt>حالة الطلب</dt>
					<dd>
						{playback.status} {lastStatus !== null && `(HTTP ${lastStatus})`}
					</dd>
					{playback.status === "ready" && (
						<>
							<dt>التوكن</dt>
							<dd>{maskedToken(playback.url)}</dd>
							<dt>ينتهي</dt>
							<dd>
								{new Date(playback.expires * 1000).toLocaleTimeString()} —{" "}
								{expired ? "منتهي" : `${secondsLeft}s`}
							</dd>
						</>
					)}
				</Box>
			</Surface>
		</PageShell>
	);
}
