import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
	const { sessionId } = await req.json();
	console.log("sessionId11222:", sessionId);

	if (!sessionId) {
		return NextResponse.json({ error: "Session ID is required" });
	}

	try {
		const session = await prisma.session.findUnique({
			where: {
				sessionId,
			},
		});

		if (!session || session.expires < new Date()) {
			return NextResponse.json({ valid: false });
		}

		return NextResponse.json({ valid: true });
	} catch (error) {
		console.error("Error checking session:", error);
		return NextResponse.json({ error: "Internal server error" });
	}
};
