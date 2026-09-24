import { getSessionUser, jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

/** Updates the signed-in user's own name/email/image. */
export async function POST(request: Request) {
	const me = await getSessionUser();
	if (!me?.email) return jsonError("Unauthorized", 401);
	if (me.email.includes("demo-")) {
		return jsonError("Can't update demo user", 403);
	}

	const { email, name, image } = await readJson(request);
	const updateData: { name?: string; email?: string; image?: string } = {};

	if (typeof name === "string" && name.trim()) updateData.name = name.trim();
	if (typeof email === "string" && email.trim()) {
		updateData.email = email.trim().toLowerCase();
	}
	if (typeof image === "string") updateData.image = image;

	if (!Object.keys(updateData).length) return jsonError("Missing Fields", 400);

	try {
		const user = await prisma.user.update({
			where: { email: me.email },
			data: updateData,
		});
		return NextResponse.json({
			email: user.email,
			name: user.name,
			image: user.image,
		});
	} catch {
		return jsonError("Something went wrong", 500);
	}
}
