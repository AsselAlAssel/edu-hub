import React from "react";
import PurchaseEmptyState from "./PurchaseEmptyState";
import PurchaseTable from "./PurchaseTable";
import { getUserSubscriptionPlan } from "@/stripe/getSubscriptionData";
// import { Price } from "@/types/priceItem";

const PurchaseHistory = async () => {
	const subscriptionPlan = await getUserSubscriptionPlan();

	return (
		<>
			{subscriptionPlan?.isSubscribed ? (
				<PurchaseTable data={subscriptionPlan} />
			) : (
				<PurchaseEmptyState />
			)}
		</>
	);
};

export default PurchaseHistory;
