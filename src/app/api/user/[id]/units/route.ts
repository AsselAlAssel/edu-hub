import { listPaidUnits } from "@/libs/access";
import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { publicUserSelect } from "@/libs/users";
import { NextRequest, NextResponse } from "next/server";

/** Admin: replaces the paid units a student can open ([] removes all). */
export const PUT = async (
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	const { unitIds } = await readJson(req);
	if (
		!isObjectId(id) ||
		!Array.isArray(unitIds) ||
		!unitIds.every(isObjectId)
	) {
		return jsonError("Missing Fields", 400);
	}

	const wanted = Array.from(new Set<string>(unitIds));
	const onSale = new Set(
		(await listPaidUnits()).flatMap((group) =>
			group.units.map((unit) => unit.id)
		)
	);
	if (!wanted.every((unitId) => onSale.has(unitId))) {
		return jsonError("Not a paid unit", 400);
	}

	const target = await prisma.user.findUnique({ where: { id } });
	if (!target) return jsonError("User not found", 404);

	const user = await prisma.user.update({
		where: { id },
		data: { unlockedUnitIds: wanted },
		select: publicUserSelect,
	});
	return NextResponse.json(user);
};
