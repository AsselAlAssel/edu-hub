import { jsonError, readJson, requireAdmin } from "@/libs/api";
import { parseLandingPayload } from "@/libs/landing";
import { prisma } from "@/libs/prismaDb";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/** Upserts the single LandingPage document. POST is kept for older clients. */
const upsertLanding = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const parsed = parseLandingPayload(await readJson(req));
	if ("error" in parsed) return jsonError(parsed.error as string, 400);

	const existing = await prisma.landingPage.findFirst();
	let saved;
	if (existing) {
		saved = await prisma.landingPage.update({
			where: { id: existing.id },
			data: parsed.data,
		});
	} else {
		saved = await prisma.landingPage.create({ data: parsed.data });
	}

	revalidatePath("/");
	return NextResponse.json(saved, { status: existing ? 200 : 201 });
};

export const PUT = upsertLanding;
export const POST = upsertLanding;
