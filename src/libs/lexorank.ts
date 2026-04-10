import { LexoRank } from "lexorank";

export function getInitialRank(): string {
	return LexoRank.middle().toString();
}

export function getRankAfterLast(lastRank?: string | null): string {
	if (!lastRank) return LexoRank.middle().toString();
	return LexoRank.parse(lastRank).genNext().toString();
}

export function getRankBetween(
	before?: string | null,
	after?: string | null
): string {
	if (!before && !after) return LexoRank.middle().toString();
	if (!before) return LexoRank.parse(after!).genPrev().toString();
	if (!after) return LexoRank.parse(before).genNext().toString();
	return LexoRank.parse(before).between(LexoRank.parse(after)).toString();
}

export function generateSequentialRanks(count: number): string[] {
	if (count === 0) return [];
	const ranks: string[] = [];
	let current = LexoRank.middle();
	for (let i = 0; i < count; i++) {
		ranks.push(current.toString());
		current = current.genNext();
	}
	return ranks;
}
