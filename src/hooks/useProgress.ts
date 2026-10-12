"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";

export type VideoProgress = {
	videoId: string;
	position: number;
	watched: number;
	completed: boolean;
	/** Sent by GET only. */
	classId?: string;
};
type Patch = Partial<Omit<VideoProgress, "videoId" | "classId">>;

const PROGRESS_KEY = "/api/progress";
/** A video counts as finished once this share of it was actually played. */
export const COMPLETE_RATIO = 0.9;
const SAVE_EVERY_MS = 15_000;

/** Seconds of real playback between two progress ticks; seeks count as 0. */
export const playedDelta = (prev: number, next: number) => {
	const delta = next - prev;
	// Ticks come every second; up to 3s allows 2x speed and a late tick.
	return delta > 0 && delta <= 3 ? delta : 0;
};

export const isWatched = (watched: number, duration: number) =>
	duration > 0 && watched >= duration * COMPLETE_RATIO;

/** Where to resume: the start again once the video was (nearly) finished. */
export const resumeAt = (position: number, duration: number) =>
	duration > 0 && position >= duration - 10 ? 0 : position;

/** "3:05" / "1:02:09" */
export const formatTime = (totalSeconds: number) => {
	const s = Math.floor(totalSeconds);
	const hh = Math.floor(s / 3600);
	const mm = Math.floor((s % 3600) / 60);
	const ss = String(s % 60).padStart(2, "0");
	return hh ? `${hh}:${String(mm).padStart(2, "0")}:${ss}` : `${mm}:${ss}`;
};

/** The signed-in student's progress; guests get an empty map and no requests. */
export default function useProgress() {
	const { data: session } = useSession();
	const signedIn = !!session?.user;
	const { data, mutate } = useSWR<VideoProgress[]>(
		signedIn ? PROGRESS_KEY : null,
		(key: string) => axios.get(key).then((res) => res.data)
	);

	const byVideo = useMemo(
		() => new Map((data ?? []).map((item) => [item.videoId, item])),
		[data]
	);

	const save = useCallback(
		async (videoId: string, patch: Patch) => {
			const { data: saved } = await axios.post<VideoProgress>(PROGRESS_KEY, {
				videoId,
				...patch,
			});
			await mutate(
				(list = []) => {
					const previous = list.find((item) => item.videoId === videoId);
					return [
						...list.filter((item) => item !== previous),
						{ ...saved, classId: previous?.classId },
					];
				},
				// A first-time video gets its classId on the next fetch
				// (SWR refetches when the classes page mounts).
				{ revalidate: false }
			);
		},
		[mutate]
	);

	return { signedIn, byVideo, save };
}

type Track = {
	videoId: string;
	last: number;
	position: number;
	watched: number;
	duration: number;
	completed: boolean;
	justCompleted: boolean;
	dirty: boolean;
	savedAt: number;
};

const payload = (t: Track) => ({
	videoId: t.videoId,
	position: resumeAt(t.position, t.duration),
	watched: t.duration ? Math.min(t.watched, t.duration) : t.watched,
	...(t.justCompleted ? { completed: true } : {}),
});

/**
 * Follows one open video: counts seconds actually played, saves the resume
 * point every 15s and on stop, and marks the video completed at 90%.
 */
export function useWatchTracker(
	save: ReturnType<typeof useProgress>["save"],
	enabled: boolean
) {
	const track = useRef<Track | null>(null);

	const flush = useCallback(() => {
		const t = track.current;
		if (!t?.dirty) return;
		const { videoId, ...patch } = payload(t);
		t.dirty = false;
		t.justCompleted = false;
		t.savedAt = Date.now();
		// A failed background save is retried on the next tick (or stop).
		save(videoId, patch).catch(() => {
			t.dirty = true;
			if (patch.completed) t.justCompleted = true;
		});
	}, [save]);

	const start = useCallback(
		(videoId: string, initial?: VideoProgress) => {
			if (!enabled) return;
			track.current = {
				videoId,
				last: initial?.position ?? 0,
				position: initial?.position ?? 0,
				watched: initial?.watched ?? 0,
				duration: 0,
				completed: initial?.completed ?? false,
				justCompleted: false,
				dirty: false,
				savedAt: Date.now(),
			};
		},
		[enabled]
	);

	const onProgress = useCallback(
		(playedSeconds: number, duration: number) => {
			const t = track.current;
			if (!t) return;
			t.watched += playedDelta(t.last, playedSeconds);
			t.last = playedSeconds;
			t.position = playedSeconds;
			t.duration = duration;
			t.dirty = true;
			if (!t.completed && isWatched(t.watched, duration)) {
				t.completed = t.justCompleted = true;
				flush();
			} else if (Date.now() - t.savedAt > SAVE_EVERY_MS) {
				flush();
			}
		},
		[flush]
	);

	const stop = useCallback(() => {
		flush();
		track.current = null;
	}, [flush]);

	// Closing the tab mid-video: a beacon survives the page unloading.
	useEffect(() => {
		const onHide = () => {
			const t = track.current;
			if (!t?.dirty) return;
			t.dirty = false;
			navigator.sendBeacon(
				PROGRESS_KEY,
				new Blob([JSON.stringify(payload(t))], { type: "application/json" })
			);
		};
		window.addEventListener("pagehide", onHide);
		return () => window.removeEventListener("pagehide", onHide);
	}, []);

	return { start, onProgress, stop };
}
