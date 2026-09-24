import bcrypt from "bcrypt";
import { cleanString, jsonError, readJson } from "@/libs/api";
import { prisma } from "@/libs/prismaDb";
import { publicUserSelect } from "@/libs/users";
import { NextResponse } from "next/server";

/** Bootstrap registration: only the configured ADMIN_EMAIL may register. */
export async function POST(request: Request) {
	const body = await readJson(request);
	const name = cleanString(body.name, 100);
	const email = cleanString(body.email, 200)?.toLowerCase();
	const password = typeof body.password === "string" ? body.password : "";

	if (!name || !email || !password) return jsonError("Missing Fields", 400);
	if (password.length < 8) return jsonError("Password too short", 400);

	if (!process.env.ADMIN_EMAIL || email !== process.env.ADMIN_EMAIL) {
		return jsonError("You are not allowed to register", 403);
	}

	if (await prisma.user.findUnique({ where: { email } })) {
		return jsonError("Email already exists", 409);
	}

	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: await bcrypt.hash(password, 10),
			role: "ADMIN",
		},
		select: publicUserSelect,
	});

	return NextResponse.json(user, { status: 201 });
}
