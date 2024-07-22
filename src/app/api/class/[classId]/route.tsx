import { prisma } from "@/libs/prismaDb";
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

    const classes = await prisma.class.findUnique({
        where: {
            id: params.classId,
        },
        include: {
            folders: true,
            videos: true,
        },
    });

    return NextResponse.json(classes);
}