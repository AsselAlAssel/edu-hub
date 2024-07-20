import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function DELETE(request: Request) {
	const session = await getServerSession(authOptions);
	const user = session?.user;

	if (!user) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const body = await request.json();
	const { id } = body;

	if (!id) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	try {
		await prisma.apiKey.delete({
			where: {
				id,
			},
		});

		return new NextResponse("API Key Deleted Successfully!", { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
