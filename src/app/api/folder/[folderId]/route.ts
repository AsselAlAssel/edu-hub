import { prisma } from "@/libs/prismaDb";
import { isUser } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";


export const GET = async (req: NextRequest, { params }: { params: { folderId: string } }) => {
    if (!(await isUser())) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const folders = await prisma.folder.findMany({
            where: {
                id: params.folderId,
            },
            include: {
                subFolders: true,
                videos: true
            }
        });
        return NextResponse.json(folders);
    } catch (error) {
        console.error(error);
        return new Response("something went wrong", { status: 500 });
    }
};
