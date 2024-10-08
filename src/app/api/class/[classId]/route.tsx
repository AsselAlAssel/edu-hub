import { getClass } from "@/libs/class";
import { isUser } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (
	req: NextRequest,
	{ params }: { params: { classId: string } }
) => {
	if (!(await isUser())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classItem = await getClass(params.classId);

	return NextResponse.json(classItem);
};
