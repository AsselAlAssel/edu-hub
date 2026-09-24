import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";

/** Mongo ObjectId: 24 hex chars. Prisma throws on anything else. */
export const isObjectId = (value: unknown): value is string =>
	typeof value === "string" && /^[a-f\d]{24}$/i.test(value);

export const jsonError = (message: string, status: number) =>
	NextResponse.json({ message }, { status });

export const getSessionUser = async () =>
	(await getServerSession(authOptions))?.user ?? null;

/** Returns an error response when the caller is not an admin, otherwise null. */
export const requireAdmin = async () => {
	const user = await getSessionUser();
	if (!user) return jsonError("Unauthorized", 401);
	if (user.role !== "ADMIN") return jsonError("Forbidden", 403);
	return null;
};

/** Parses a JSON body; returns {} for empty/invalid bodies so callers hit their own 400s. */
export const readJson = async (req: Request): Promise<Record<string, any>> => {
	try {
		const body = await req.json();
		return body && typeof body === "object" ? body : {};
	} catch {
		return {};
	}
};

/** Trimmed non-empty string, or null. */
export const cleanString = (value: unknown, maxLength = 200) => {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed && trimmed.length <= maxLength ? trimmed : null;
};
