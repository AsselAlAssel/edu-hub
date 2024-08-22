import { prisma } from "@/libs/prismaDb";
import { isAdmin } from "@/libs/uitls";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const {
		headerTitle,
		headerSubtitle,
		headerImage,
		landingVideo,
		aboutTitle,
		aboutSubtitle,
		aboutImage,
		whatsAppNumber,
		address,
		email,
		landingVideoId,
	} = body;
	if (!headerTitle || !aboutTitle || !whatsAppNumber || !address || !email) {
		return NextResponse.json(
			{
				message: "Missing Fields",
			},
			{ status: 400 }
		);
	}
	if (!(await isAdmin())) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}

	const landing = await prisma.landingPage.create({
		data: {
			headerTitle,
			headerSubtitle,
			headerImage,
			landingVideo,
			aboutTitle,
			aboutSubtitle,
			aboutImage,
			whatsAppNumber,
			address,
			email,
			landingVideoId,
		},
	});

	return new NextResponse(JSON.stringify(landing), { status: 201 });
};

export const PUT = async (req: NextRequest) => {
	const body = await req.json();
	const {
		headerTitle,
		headerSubtitle,
		headerImage,
		landingVideo,
		aboutTitle,
		aboutSubtitle,
		aboutImage,
		whatsAppNumber,
		address,
		email,
		landingVideoId,
	} = body;
	if (!headerTitle || !aboutTitle || !whatsAppNumber || !address || !email) {
		return NextResponse.json(
			{
				message: "Missing Fields",
			},
			{ status: 400 }
		);
	}
	if (!(await isAdmin())) {
		return NextResponse.json(
			{
				message: "Unauthorized",
			},
			{ status: 401 }
		);
	}

	const landing = await prisma.landingPage.findFirst();
	if (!landing || !landing.id) {
		return NextResponse.json(
			{
				message: "Not Found",
			},
			{ status: 404 }
		);
	}

	await prisma.landingPage.update({
		where: {
			id: landing.id,
		},
		data: {
			headerTitle,
			headerSubtitle,
			headerImage,
			landingVideo,
			landingVideoId,
			aboutTitle,
			aboutSubtitle,
			aboutImage,
			whatsAppNumber,
			address,
			email,
		},
	});
	return new NextResponse(JSON.stringify(landing), { status: 200 });
};
