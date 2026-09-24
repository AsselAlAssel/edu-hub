import { requireAdmin } from "@/libs/api";
import { listUsers } from "@/libs/users";
import { NextResponse } from "next/server";

// Was a static, unauthenticated dump of the user table (including password
// hashes). Kept for URL compatibility; prefer GET /api/user.
export const dynamic = "force-dynamic";

export async function GET() {
	const denied = await requireAdmin();
	if (denied) return denied;

	return NextResponse.json(await listUsers());
}
