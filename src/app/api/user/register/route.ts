import bcrypt from "bcrypt";
import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const body = await request.json();
	const { name, email, password } = body;

	if (!name || !email || !password) {
		return new NextResponse("Missing Fields", { status: 400 });
	}

	const formatedEmail = email.toLowerCase();

	const exist = await prisma.user.findUnique({
		where: {
			email: formatedEmail,
		},
	});

	if (exist) {
		throw new Error("Email already exists");
	}

	const adminEmails = process.env.ADMIN_EMAIL;

	const isAdminEmail = formatedEmail === adminEmails;
	if (!isAdminEmail) {
		return new NextResponse("You are not allowed to register", { status: 403 });
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = {
		name,
		email: formatedEmail,
		password: hashedPassword,
		role: "ADMIN",
	};

	try {
		const user = await prisma.user.create({
			data: {
				...newUser,
			},
		});

		return NextResponse.json(user);
	} catch (error) {
		console.error(error);
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
