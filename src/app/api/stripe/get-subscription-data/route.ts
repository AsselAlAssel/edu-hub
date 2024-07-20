import { getUserSubscriptionPlan } from "@/stripe/getSubscriptionData";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const subscriptionPlan = await getUserSubscriptionPlan();
		return NextResponse.json({ subscriptionPlan }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: error }, { status: 400 });
	}
}
