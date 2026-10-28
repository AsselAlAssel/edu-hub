import { getViewer } from "@/libs/access";
import { isObjectId, jsonError } from "@/libs/api";
import { getResources, isHiddenFrom } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	props: { params: Promise<{ folderId: string }> }
) => {
	const { folderId } = await props.params;
	if (!isObjectId(folderId)) return jsonError("Invalid folder id", 400);

	const viewer = await getViewer();
	// A hidden class does not exist for students and guests.
	if (await isHiddenFrom(folderId, viewer)) return jsonError("Not Found", 404);

	const resources = await getResources(folderId, viewer ?? undefined);
	return NextResponse.json(resources, {
		headers: { "Cache-Control": "private, no-store" },
	});
};
