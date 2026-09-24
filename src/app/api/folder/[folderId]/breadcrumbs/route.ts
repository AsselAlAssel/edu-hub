import { isObjectId, jsonError } from "@/libs/api";
import { getBreadcrumbs } from "@/libs/folder";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	_req: NextRequest,
	props: { params: Promise<{ folderId: string }> }
) => {
	const { folderId } = await props.params;
	if (!isObjectId(folderId)) return jsonError("Invalid folder id", 400);

	const breadcrumbs = await getBreadcrumbs(folderId);
	if (!breadcrumbs) return jsonError("Folder not found", 404);

	return NextResponse.json({ breadcrumbs });
};
