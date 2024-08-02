import { getClasses } from "@/libs/class";
import { prisma } from "@/libs/prismaDb";
import { isAdmin, isUser } from "@/libs/uitls";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { name, description } = body;

	if (!name) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classItem = await prisma.class.create({
		data: {
			name,
			description: description || "",
		},
	});

	await prisma.folder.create({
		data: {
			name: "Root Folder",
			classId: classItem.id,
			isRoot: true,
		},
	});

	return new NextResponse("Class created", { status: 201 });
};

export const GET = async () => {
	if (!(await isUser())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classes = await getClasses();

	return NextResponse.json(classes);
};

export const PUT = async (req: Request) => {
	const body = await req.json();
	const { id, name } = body;

	if (!id || !name) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	await prisma.class.update({
		where: {
			id,
		},
		data: {
			name,
		},
	});

	return new NextResponse("Class updated", { status: 200 });
};

export const DELETE = async (req: Request) => {
	const body = await req.json();
	const { id } = body;

	if (!id) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}
	const folders = await prisma.folder.findMany({
		where: {
			classId: id,
		},
	});

	// Delete each folder
	for (const folder of folders) {
		await prisma.folder.delete({
			where: {
				id: folder.id,
			},
		});
	}

	// Then, delete the class
	// await prisma.class.delete({
	// 	where: {
	// 		id,
	// 	},
	// });

	return new NextResponse("Class deleted", { status: 200 });
};
