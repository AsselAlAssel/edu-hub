import { isObjectId, jsonError } from "@/libs/api";
import { getResources } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	props: { params: Promise<{ folderId: string }> }
) => {
	const { folderId } = await props.params;
	if (!isObjectId(folderId)) return jsonError("Invalid folder id", 400);

	const resources = await getResources(folderId);
	return NextResponse.json(resources);
};
