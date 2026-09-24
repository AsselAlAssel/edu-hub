import { jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	const { sessionId } = await readJson(req);
	if (typeof sessionId !== "string" || !sessionId) {
		return jsonError("Session ID is required", 400);
	}

	try {
		const session = await prisma.session.findUnique({ where: { sessionId } });
		const valid = !!session && session.expires >= new Date();
		return NextResponse.json({ valid });
	} catch (error) {
		console.error("Error checking session:", error);
		return jsonError("Internal server error", 500);
	}
};
