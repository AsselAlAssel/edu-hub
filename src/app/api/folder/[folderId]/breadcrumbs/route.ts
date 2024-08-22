import { getBreadcrumbs } from "@/libs/folder";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	req: NextRequest,
	{ params }: { params: { folderId: string } }
) => {
	try {
		// Fetch the breadcrumbs using the utility function
		const breadcrumbs = await getBreadcrumbs(params.folderId);

		return NextResponse.json({ breadcrumbs });
	} catch (error) {
		console.error("Error fetching breadcrumbs:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
