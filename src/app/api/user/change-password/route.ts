import bcrypt from "bcrypt";
import { getSessionUser, jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

/** Changes the signed-in user's password (the `email` field must match the session). */
export async function POST(request: Request) {
	const me = await getSessionUser();
	if (!me?.email) return jsonError("Unauthorized", 401);

	const { email, password, currentPassword } = await readJson(request);
	if (
		typeof password !== "string" ||
		typeof currentPassword !== "string" ||
		password.length < 8
	) {
		return jsonError("Missing Fields", 400);
	}

	const formattedEmail = me.email.toLowerCase();
	if (typeof email === "string" && email.toLowerCase() !== formattedEmail) {
		return jsonError("Forbidden", 403);
	}

	const user = await prisma.user.findUnique({
		where: { email: formattedEmail },
	});
	if (!user?.password) return jsonError("User not found", 404);
	if (user.email?.includes("demo-")) {
		return jsonError("Can't change password for demo user", 403);
	}

	if (!(await bcrypt.compare(currentPassword, user.password))) {
		return jsonError("Incorrect current password!", 400);
	}

	await prisma.user.update({
		where: { email: formattedEmail },
		data: { password: await bcrypt.hash(password, 10) },
	});

	return NextResponse.json({ message: "Password Updated" });
}
