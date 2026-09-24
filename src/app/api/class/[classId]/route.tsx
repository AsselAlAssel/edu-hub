import { getSessionUser, isObjectId, jsonError } from "@/libs/api";
import { getClass } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	props: { params: Promise<{ classId: string }> }
) => {
	const { classId } = await props.params;
	if (!(await getSessionUser())) return jsonError("Unauthorized", 401);
	if (!isObjectId(classId)) return jsonError("Invalid class id", 400);

	const classItem = await getClass(classId);
	if (!classItem) return jsonError("Class not found", 404);

	return NextResponse.json(classItem);
};
