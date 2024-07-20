"use client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import SectionHeader from "@/components/Common/SectionHeader";
import PriceItem from "./PriceItem";

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
		<section
			id='pricing'
			className='overflow-hidden py-17.5 lg:py-22.5 xl:py-27.5'
		>
			{/* <!-- section title --> */}
			<SectionHeader
				title={"Simple Affordable Pricing"}
				description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent condimentum dictum euismod malesuada lacus, non consequat quam.'
			/>

		</section>
	);
};

export default Pricing;
