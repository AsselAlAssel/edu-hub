import { authOptions } from "@/libs/auth";
import { prisma } from "@/libs/prismaDb";
import { isAdmin, isUser } from "@/libs/uitls";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const POST = async (req: Request) => {
	const body = await req.json();
	const { name } = body;

	if (!name) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	if (!(await isAdmin())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	await prisma.class.create({
		data: {
			name,
		},
	});

	return new NextResponse("Class created", { status: 201 });
};

export const GET = async () => {
	if (!(await isUser())) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const classes = await prisma.class.findMany();

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

	await prisma.class.delete({
		where: {
			id,
		},
	});

	return new NextResponse("Class deleted", { status: 200 });
};
