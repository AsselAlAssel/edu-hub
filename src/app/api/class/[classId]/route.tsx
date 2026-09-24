import { getSessionUser, isObjectId, jsonError } from "@/libs/api";
import { getClass } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: { classId: string } }
) => {
	if (!(await getSessionUser())) return jsonError("Unauthorized", 401);
	if (!isObjectId(params.classId)) return jsonError("Invalid class id", 400);

	const classItem = await getClass(params.classId);
	if (!classItem) return jsonError("Class not found", 404);

	return NextResponse.json(classItem);
};
