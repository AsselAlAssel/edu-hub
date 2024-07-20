import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const users = await prisma.user.findMany();
		return new NextResponse(JSON.stringify(users), { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
