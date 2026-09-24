import {
	getSessionUser,
	isObjectId,
	jsonError,
	readJson,
	requireAdmin,
} from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import {
	listUsers,
	publicUserSelect,
	ROLES,
	type RoleName,
} from "@/libs/users";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Admin: list users without credentials. */
export const GET = async () => {
	const denied = await requireAdmin();
	if (denied) return denied;

	return NextResponse.json(await listUsers());
};

/** Admin: change a user's role. Admins cannot change their own role. */
export const PATCH = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id, role } = await readJson(req);
	if (!isObjectId(id) || !ROLES.includes(role as RoleName)) {
		return jsonError("Missing Fields", 400);
	}

	const me = await getSessionUser();
	if (me?.id === id) return jsonError("Cannot change your own role", 400);

	const target = await prisma.user.findUnique({ where: { id } });
	if (!target) return jsonError("User not found", 404);

	const user = await prisma.user.update({
		where: { id },
		data: { role },
		select: publicUserSelect,
	});
	return NextResponse.json(user);
};

/** Admin: delete another user (sessions cascade). */
export const DELETE = async (req: NextRequest) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await readJson(req);
	if (!isObjectId(id)) return jsonError("Missing Fields", 400);

	const me = await getSessionUser();
	if (me?.id === id) return jsonError("Cannot delete your own account", 400);

	const target = await prisma.user.findUnique({ where: { id } });
	if (!target) return jsonError("User not found", 404);

	await prisma.user.delete({ where: { id } });
	return new NextResponse(null, { status: 204 });
};
