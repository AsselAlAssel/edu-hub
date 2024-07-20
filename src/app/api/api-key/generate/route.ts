import { NextResponse } from "next/server";
// import crypto from "crypto";
import { prisma } from "@/libs/prismaDb";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
	const body = await request.json();
	const { email, keyName } = body;

	if (!email) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	const formatedEmail = email.toLowerCase();

	const user = await prisma.user.findUnique({
		where: {
			email: formatedEmail,
		},
	});

	if (!user) {
		return new NextResponse("User not found!", { status: 400 });
	}

	// Generate a random key
	const key = user.role as string;

	// Hash the key
	const hashedKey = await bcrypt.hash(key, 10);

	try {
		await prisma.apiKey.create({
			data: {
				name: keyName,
				key: hashedKey,
				userId: user.id,
			},
		});

		return new NextResponse(key, { status: 200 });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
