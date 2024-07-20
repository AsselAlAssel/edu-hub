import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function DELETE(request: Request) {
	const body = await request.json();
	const { email } = body;

	if (!email) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	const session = await getServerSession(authOptions);
	const formatedEmail = email.toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email: formatedEmail,
		},
	});

	const isOthorized = session?.user?.email === email || user?.role === "ADMIN";

	if (!isOthorized) {
		return new NextResponse("Unauthorized", { status: 401 });
	}

	const isDemoUser = user?.email?.includes("demo-");

	if (isDemoUser) {
		return new NextResponse("Can't delete demo user", { status: 401 });
	}

	try {
		await prisma.user.delete({
			where: {
				email: formatedEmail,
			},
		});

		return new NextResponse("Account Deleted Successfully!", { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
