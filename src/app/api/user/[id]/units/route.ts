import { listPaidUnits, unitAccessEnd, unitAccessEndOn } from "@/libs/access";
import { isObjectId, jsonError, readJson, requireAdmin } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { nextUnitGrants } from "@/libs/unitGrants";
import { publicUserSelect } from "@/libs/users";
import { NextRequest, NextResponse } from "next/server";

/**
 * Admin: sets the paid units a student can open ([] removes all). Newly opened
 * (or expired) units close at the yearly cutoff; units already open keep their
 * end date. `expiresAt` ({ unitId: "YYYY-MM-DD" }) sets end dates by hand.
 */
export const PUT = async (
	req: NextRequest,
	props: { params: Promise<{ id: string }> }
) => {
	const denied = await requireAdmin();
	if (denied) return denied;

	const { id } = await props.params;
	const { unitIds, expiresAt = {} } = await readJson(req);
	if (
		!isObjectId(id) ||
		!Array.isArray(unitIds) ||
		!unitIds.every(isObjectId) ||
		typeof expiresAt !== "object" ||
		expiresAt === null ||
		Array.isArray(expiresAt)
	) {
		return jsonError("Missing Fields", 400);
	}

	const wanted = Array.from(new Set<string>(unitIds));
	const overrides: Record<string, Date> = {};
	for (const [unitId, day] of Object.entries(expiresAt)) {
		const end = unitAccessEndOn(day);
		if (!wanted.includes(unitId) || !end) {
			return jsonError("Invalid end date", 400);
		}
		overrides[unitId] = end;
	}
	const onSale = new Set(
		(await listPaidUnits()).flatMap((group) =>
			group.units.map((unit) => unit.id)
		)
	);
	if (!wanted.every((unitId) => onSale.has(unitId))) {
		return jsonError("Not a paid unit", 400);
	}

	const target = await prisma.user.findUnique({
		where: { id },
		select: { unitGrants: true },
	});
	if (!target) return jsonError("User not found", 404);

	const user = await prisma.user.update({
		where: { id },
		data: {
			unitGrants: nextUnitGrants(target.unitGrants ?? [], wanted, {
				freshEnd: unitAccessEnd(),
				overrides,
			}),
		},
		select: publicUserSelect,
	});
	return NextResponse.json(user);
};
