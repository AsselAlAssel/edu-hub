import { NextResponse } from "next/server";
import Stripe from "stripe";
import { absoluteUrl } from "@/libs/uitls";
import { isAuthorized } from "@/libs/isAuthorized";

export async function POST(request: Request) {
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
		apiVersion: "2023-10-16",
	});
	const data = await request.json();
	const { isSubscribed, stripeCustomerId, stripePriceId, userId } = data;

	let billingUrl;
	let successUrl;

	const user = await isAuthorized();
	if (user) {
		successUrl = absoluteUrl("user/billing");
		billingUrl = absoluteUrl("user/billing");
	} else {
		successUrl = absoluteUrl("/thank-you");
		billingUrl = absoluteUrl("/");
	}

	if (isSubscribed && stripeCustomerId) {
		const stripeSession = await stripe.billingPortal.sessions.create({
			customer: stripeCustomerId,
			return_url: billingUrl,
		});

		return NextResponse.json({ url: stripeSession.url }, { status: 200 });
	}

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price: stripePriceId,
				quantity: 1,
			},
		],
		mode: "subscription",
		success_url: successUrl,
		cancel_url: billingUrl,
		metadata: {
			userId,
		},
	});

	return NextResponse.json({ url: session.url });
}
