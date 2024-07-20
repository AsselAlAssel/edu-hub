"use client";
import React, { useState } from "react";
import SetApiKeyCard from "./SetApiKeyCard";
import InputCard from "./InputCard";
import OutputCard from "./OutputCard";
import axios from "axios";
import toast from "react-hot-toast";

const AiIntegration = ({ APIKey }: { APIKey: string }) => {
	const [data, setData] = useState({
		num: "",
		topic: "",
		type: "",
	});

	const [generatedData, setGeneratedData] = useState("");

	let apiKey = APIKey;

	if (typeof window !== "undefined" && !APIKey) {
		apiKey = localStorage.getItem("apiKey") || "";
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setData({
			...data,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setGeneratedData("Loading....");

		// the prompt
		const prompt = [
			{
				role: "system",
				content:
					"You will be provided with the content topic and the number of paragraphs and the content type. Your task is to generate the content with the exact paragraphs number if the format is tweet then it must be one paragraph \n",
			},
			{
				role: "user",
				content: `Content Topic: ${data.topic} \nNumber of Paragraphs: ${data.num} \nContent format: ${data.type}`,
			},
			{
				role: "user",
				content:
					"Remove all the paragraph title and add line break after each paragraph",
			},
		];

		//for the demo
		const apiKey = localStorage.getItem("apiKey");

		try {
			const response = await axios.post(
				"/api/generate-content",
				{ apiKey, prompt },
				{
					headers: {
						"Content-Type": "application/json", // Adjust headers as needed
					},
				}
			);
			setGeneratedData(response.data);
		} catch (error: any) {
			setGeneratedData(error?.response?.data);
			toast.error(error?.response?.data.substr(0, 32));
		}

		setData({
			num: "",
			topic: "",
			type: "",
		});
	};
	return (
		<>
			{!apiKey ? (
				<SetApiKeyCard />
			) : (
				<div className='-mx-5 flex flex-wrap'>
					<div className='w-full px-5 md:w-5/12'>
						<InputCard
							data={data}
							handleChange={handleChange}
							handleSubmit={handleSubmit}
						/>
					</div>
					<div className='w-full px-4 md:w-7/12'>
						<OutputCard generated={generatedData} />
					</div>
				</div>
			)}
		</>
	);
};

export default AiIntegration;
