import { getResources } from "@/libs/class";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	req: NextRequest,
	{ params }: { params: { folderId: string } }
) => {
	const resources = await getResources(params.folderId);

	return NextResponse.json(resources);
};
