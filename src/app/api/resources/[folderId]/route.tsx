import { getResources } from "@/libs/class";
import { isUser } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	req: NextRequest,
	{ params }: { params: { folderId: string } }
) => {
	if (!(await isUser())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const resources = await getResources(params.folderId);

	return NextResponse.json(resources);
};
