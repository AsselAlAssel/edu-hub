import { isObjectId, jsonError } from "@/libs/api";
import { getResources } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: { folderId: string } }
) => {
	if (!isObjectId(params.folderId)) return jsonError("Invalid folder id", 400);

	const resources = await getResources(params.folderId);
	return NextResponse.json(resources);
};
