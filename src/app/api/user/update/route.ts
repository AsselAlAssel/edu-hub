import { prisma } from "@/libs/prismaDb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
	const body = await request.json();
	const { email, name, image } = body;

	const session = await getServerSession(authOptions);
	const updateData: { [key: string]: any } = {};

	const isDemo = session?.user?.email?.includes("demo-");

	if (!session?.user) {
		return new NextResponse(JSON.stringify("User not found!"), { status: 400 });
	}

	if (body === null) {
		return new NextResponse(JSON.stringify("Missing Fields"), { status: 400 });
	}

	if (name) {
		updateData.name = name;
	}

	if (email) {
		updateData.email = email.toLowerCase();
	}

	if (image) {
		updateData.image = image;
	}

	if (isDemo) {
		return new NextResponse(JSON.stringify("Can't update demo user"), {
			status: 401,
		});
	}

	try {
		const user = await prisma.user.update({
			where: {
				email: session?.user?.email as string,
			},
			data: {
				...updateData,
			},
		});

		revalidatePath("/user");

		return NextResponse.json(
			{
				email: user.email,
				name: user.name,
				image: user.image,
			},
			{ status: 200 }
		);

		// return new NextResponse(JSON.stringify("User Updated Successfully!"), {
		// 	status: 200,
		// });
	} catch (error) {
		return new NextResponse("Something went wrong", { status: 500 });
	}
}
