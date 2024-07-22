import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const { name, parentFolderId, classId } = body;

    if (!name) {
        return new Response("Missing Fields", { status: 400 });
    }
    if (!(await isAdmin())) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        await prisma.folder.create({
            data: {
                name,
                parentFolderId,
                classId
            },
        });
        return new Response("Folder created", { status: 201 });
    } catch (error) {
        console.error(error);
        return new Response("something went wrong", { status: 500 });
    }
};


export const PUT = async (req: NextRequest) => {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name) {
        return new Response("Missing Fields", { status: 400 });
    }
    if (!(await isAdmin())) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        await prisma.folder.update({
            where: { id },
            data: {
                name,
            },
        });
        return new Response("Folder updated", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("something went wrong", { status: 500 });
    }
};


export const DELETE = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response("Missing Fields", { status: 400 });
    }
    if (!(await isAdmin())) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        await prisma.folder.delete({
            where: { id },
        });
        return new Response("Folder deleted", { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response("something went wrong", { status: 500 });
    }
};

