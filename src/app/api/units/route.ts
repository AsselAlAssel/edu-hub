import { listPaidUnits } from "@/libs/access";
import { requireAdmin } from "@/libs/api";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Admin: every paid unit, grouped by class (for the unlock dialog). */
export const GET = async () => {
	const denied = await requireAdmin();
	if (denied) return denied;

	return NextResponse.json(await listPaidUnits());
};
