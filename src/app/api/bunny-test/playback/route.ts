import { getSessionUser, jsonError } from "@/libs/api";
import {
	BUNNY_TOKEN_TTL_SECONDS,
	bunnyTestConfig,
	canUseBunnyTest,
	signBunnyEmbedUrl,
} from "@/libs/bunny";
import { NextResponse } from "next/server";

// Temporary Bunny Stream experiment: delete with src/app/(site)/bunny-test.
export const GET = async () => {
	const user = await getSessionUser();
	if (!user) return jsonError("Unauthorized", 401);
	if (!canUseBunnyTest(user)) return jsonError("Forbidden", 403);

	const config = bunnyTestConfig();
	if (!config) return jsonError("Bunny Stream is not configured", 500);

	try {
		const expires = Math.floor(Date.now() / 1000) + BUNNY_TOKEN_TTL_SECONDS;
		const url = signBunnyEmbedUrl({ ...config, expires });
		return NextResponse.json(
			{ url, expires },
			{ headers: { "Cache-Control": "no-store" } }
		);
	} catch {
		// Never log the signed URL or the key.
		console.error("bunny-test: failed to sign the embed URL");
		return jsonError("Failed to create the playback URL", 500);
	}
};
