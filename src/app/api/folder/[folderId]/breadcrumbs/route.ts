import { isObjectId, jsonError } from "@/libs/api";
import { getBreadcrumbs } from "@/libs/folder";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: { folderId: string } }
) => {
	if (!isObjectId(params.folderId)) return jsonError("Invalid folder id", 400);

	const breadcrumbs = await getBreadcrumbs(params.folderId);
	if (!breadcrumbs) return jsonError("Folder not found", 404);

	return NextResponse.json({ breadcrumbs });
};
