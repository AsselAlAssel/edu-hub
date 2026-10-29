/** First load, and the size of each "load more" while moving forward. */
export const PAGE_SIZE = 10;
/** On a jump to an unloaded question: this many before and after it. */
export const JUMP_RADIUS = 5;
/** Start loading the next page when this close to the end of what is loaded. */
export const PREFETCH_DISTANCE = 3;

/**
 * The half-open range [from, to) to fetch so `current` (and the next few
 * questions) are on hand, or null when nothing is missing. `has(i)` says
 * whether question i is loaded or already being fetched.
 */
export function rangeToLoad(
	current: number,
	total: number,
	has: (index: number) => boolean
): [number, number] | null {
	if (!has(current)) {
		// Jumped (or first load): around the question, at least a full page.
		const from = Math.max(0, current - JUMP_RADIUS);
		const to = Math.min(
			total,
			Math.max(from + PAGE_SIZE, current + JUMP_RADIUS + 1)
		);
		return trim(from, to, has);
	}
	for (
		let i = current + 1;
		i <= current + PREFETCH_DISTANCE && i < total;
		i++
	) {
		if (!has(i)) return trim(i, Math.min(total, i + PAGE_SIZE), has);
	}
	return null;
}

/** Drops already-loaded questions from both ends of the range. */
function trim(from: number, to: number, has: (index: number) => boolean) {
	while (from < to && has(from)) from++;
	while (to > from && has(to - 1)) to--;
	return from < to ? ([from, to] as [number, number]) : null;
}
