import { requireAdmin } from "@/libs/api";
import { getUserStats } from "@/libs/users";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Admin: user counts and monthly sign-ups for the users dashboard. */
export async function GET() {
	const denied = await requireAdmin();
	if (denied) return denied;

	return NextResponse.json(await getUserStats());
}
