import { prisma } from "@/libs/prismaDb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
	const body = await req.json();
	const { email } = body;

	try {
		const user = await prisma.user.findUnique({
			where: {
				email: email.toLowerCase(),
			},
		});
		return new NextResponse(JSON.stringify(user), { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
