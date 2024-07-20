import { prisma } from "@/libs/prismaDb";
import { stripe } from "@/stripe/stripe";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import type Stripe from "stripe";

export async function POST(request: Request) {
	const body = await request.text();
	const signature = headers().get("Stripe-Signature") ?? "";

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(
			body,
			signature,
			process.env.STRIPE_WEBHOOK_SECRET || ""
		);
	} catch (err) {
		return new Response(
			`Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
			{ status: 400 }
		);
	}

	const session = event.data.object as Stripe.Checkout.Session;
	const email = session.customer_details?.email?.toLowerCase() as string;

	if (!email) {
		return new Response(null, {
			status: 200,
		});
	}

	// when first purchased
	if (event.type === "checkout.session.completed") {
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		);

		// Update the price id and set the new period end.
		const exist = await prisma.user.findUnique({
			where: {
				email,
			},
		});

		if (!exist) {
			await prisma.user.create({
				data: {
					name: "guest",
					email,
					password: "guset-user",
					stripeSubscriptionId: subscription.id,
					stripeCustomerId: subscription.customer as string,
					stripePriceId: subscription.items.data[0].price.id,
					stripeCurrentPeriodEnd: new Date(
						subscription.current_period_end * 1000
					),
				},
			});
		} else {
			await prisma.user.update({
				where: {
					email: session.customer_details?.email as string,
				},
				data: {
					stripeSubscriptionId: subscription.id,
					stripeCustomerId: subscription.customer as string,
					stripePriceId: subscription.items.data[0].price.id,
					stripeCurrentPeriodEnd: new Date(
						subscription.current_period_end * 1000
					),
				},
			});
		}
	}

	// when renewed the subscription
	if (event.type === "invoice.payment_succeeded") {
		// Retrieve the subscription details from Stripe.
		const subscription = await stripe.subscriptions.retrieve(
			session.subscription as string
		);

		// Update the price id and set the new period end.
		await prisma.user.update({
			where: {
				stripeSubscriptionId: subscription.id,
			},
			data: {
				stripePriceId: subscription.items.data[0].price.id,
				stripeCurrentPeriodEnd: new Date(
					subscription.current_period_end * 1000
				),
			},
		});
	}

	revalidatePath("/user/billing");

	return new Response(null, { status: 200 });
}
