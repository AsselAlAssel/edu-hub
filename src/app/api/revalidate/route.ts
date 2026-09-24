import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/** Signed Sanity webhook: revalidates the cache tag named by the document type. */
export async function POST(req: NextRequest) {
	try {
		const signature = req.headers.get(SIGNATURE_HEADER_NAME);
		const secret = process.env.SANITY_HOOK_SECRET;
		const payload = await req.text();

		if (
			!signature ||
			!secret ||
			!(await isValidSignature(payload, signature, secret))
		) {
			return new Response("Invalid Signature", { status: 401 });
		}

		const body = JSON.parse(payload) as { _type?: string; slug?: string };
		if (!body?._type) {
			return new Response("Bad Request", { status: 400 });
		}

		revalidateTag(body._type);
		return NextResponse.json({
			status: 200,
			revalidated: true,
			now: Date.now(),
			body,
		});
	} catch (error) {
		console.error(error);
		return new Response(
			error instanceof Error ? error.message : "Internal Error",
			{ status: 500 }
		);
	}
}
