"use client";
import React, { useEffect, useState, useRef } from "react";
import { pricingData } from "@/stripe/pricingData";
import PriceItem from "@/components/Home/Pricing/PriceItem";
import axios from "axios";

async function getData() {
	try {
		const res = await axios.get("/api/stripe/get-subscription-data");
		return res.data.subscriptionPlan;
	} catch (error) {
		console.error((error as Error).message);
	}
}

const Pricing = () => {
	const [subscriptionPlan, setSubscriptionPlan] = useState<any>();
	const firstLoad = useRef<any>(false);

	const getuser = async () => {
		const res: any = await getData();
		setSubscriptionPlan(res);
	};

	useEffect(() => {
		if (!firstLoad.current) {
			firstLoad.current = true;
			getuser();
		}
		return;
	}, []);

	return (
		<section className='overflow-hidden rounded-10 bg-white py-15 dark:bg-[#131a2b] md:px-15'>
			<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
				<div className='grid grid-cols-1 gap-7.5 md:grid-cols-2 xl:grid-cols-3'>
					{pricingData &&
						pricingData.map((price, key) => (
							<PriceItem
								plan={{ ...price }}
								key={key}
								isBilling={true}
								subscriptionPlan={subscriptionPlan}
							/>
						))}
				</div>
			</div>
		</section>
	);
};

export default Pricing;
