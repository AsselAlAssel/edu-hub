import { getSessionUser, jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

/**
 * Deletes by email. Allowed for the account owner or an admin.
 * (Previously authorised when the *target* was an admin — i.e. anyone could
 * delete any admin account.)
 */
export async function DELETE(request: Request) {
	const me = await getSessionUser();
	if (!me) return jsonError("Unauthorized", 401);

	const { email } = await readJson(request);
	if (typeof email !== "string" || !email.trim()) {
		return jsonError("Missing Fields", 400);
	}

	const formattedEmail = email.trim().toLowerCase();
	const isSelf = me.email?.toLowerCase() === formattedEmail;
	if (!isSelf && me.role !== "ADMIN") return jsonError("Forbidden", 403);

	const user = await prisma.user.findUnique({
		where: { email: formattedEmail },
	});
	if (!user) return jsonError("User not found", 404);
	if (user.email?.includes("demo-")) {
		return jsonError("Can't delete demo user", 403);
	}

	await prisma.user.delete({ where: { email: formattedEmail } });
	return NextResponse.json({ message: "Account Deleted Successfully!" });
}
