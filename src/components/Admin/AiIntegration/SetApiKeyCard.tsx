"use client";
import Card from "@/components/Common/Dashboard/Card";
import { useState } from "react";
import SetApiKeyModal from "./SetApiKeyModal";

export default function SetApiKeyCard() {
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<Card>
				<div className='mx-auto w-full max-w-[510px] py-20 text-center'>
					<div className='mb-6 flex justify-center'>
						<svg
							width='120'
							height='120'
							viewBox='0 0 120 120'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle
								opacity='0.08'
								cx='60'
								cy='60'
								r='59.5'
								fill='url(#paint0_linear_2175_14434)'
							/>
							<circle
								opacity='0.15'
								cx='60.0014'
								cy='60.0016'
								r='49.98'
								fill='url(#paint1_linear_2175_14434)'
							/>
							<path
								fillRule='evenodd'
								clipRule='evenodd'
								d='M80.8332 60C80.8332 71.5059 71.5058 80.8333 59.9998 80.8333C48.4939 80.8333 39.1665 71.5059 39.1665 60C39.1665 48.494 48.4939 39.1666 59.9998 39.1666C71.5058 39.1666 80.8332 48.494 80.8332 60ZM59.9998 71.9791C60.8628 71.9791 61.5623 71.2796 61.5623 70.4166V57.9166C61.5623 57.0537 60.8628 56.3541 59.9998 56.3541C59.1369 56.3541 58.4373 57.0537 58.4373 57.9166V70.4166C58.4373 71.2796 59.1369 71.9791 59.9998 71.9791ZM59.9998 49.5833C61.1504 49.5833 62.0832 50.516 62.0832 51.6666C62.0832 52.8172 61.1504 53.75 59.9998 53.75C58.8492 53.75 57.9165 52.8172 57.9165 51.6666C57.9165 50.516 58.8492 49.5833 59.9998 49.5833Z'
								fill='#635BFF'
							/>
							<defs>
								<linearGradient
									id='paint0_linear_2175_14434'
									x1='60'
									y1='0.5'
									x2='60'
									y2='119.5'
									gradientUnits='userSpaceOnUse'
								>
									<stop stopColor='#5750F1' stopOpacity='0' />
									<stop offset='1' stopColor='#5750F1' />
								</linearGradient>
								<linearGradient
									id='paint1_linear_2175_14434'
									x1='60.0014'
									y1='10.0216'
									x2='60.0014'
									y2='109.982'
									gradientUnits='userSpaceOnUse'
								>
									<stop stopColor='#5750F1' />
									<stop offset='1' stopColor='#5750F1' stopOpacity='0' />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<h2 className='mb-3.5 font-satoshi text-heading-5 font-bold tracking-[-.5px] text-dark dark:text-white'>
						You need an OpenAI API Key to use AI Tools Template&#39;s features.
					</h2>
					<p className='mb-7.5 text-sm tracking-[-.14px] text-body'>
						So set your API key first and start using...
					</p>
					<button
						onClick={() => setShowModal(true)}
						className='inline-flex h-[52px] items-center justify-center gap-2 rounded-lg bg-primary px-10 font-satoshi font-medium text-white duration-300 hover:bg-primary-dark'
					>
						<span>
							<svg
								width='21'
								height='21'
								viewBox='0 0 21 21'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									fillRule='evenodd'
									clipRule='evenodd'
									d='M10.4998 18.8334C15.1022 18.8334 18.8332 15.1024 18.8332 10.5C18.8332 5.89765 15.1022 2.16669 10.4998 2.16669C5.89746 2.16669 2.1665 5.89765 2.1665 10.5C2.1665 15.1024 5.89746 18.8334 10.4998 18.8334ZM11.1248 8.00002C11.1248 7.65484 10.845 7.37502 10.4998 7.37502C10.1547 7.37502 9.87484 7.65484 9.87484 8.00002L9.87484 9.87504H7.99984C7.65466 9.87504 7.37484 10.1549 7.37484 10.5C7.37484 10.8452 7.65466 11.125 7.99984 11.125H9.87484V13C9.87484 13.3452 10.1547 13.625 10.4998 13.625C10.845 13.625 11.1248 13.3452 11.1248 13L11.1248 11.125H12.9998C13.345 11.125 13.6248 10.8452 13.6248 10.5C13.6248 10.1549 13.345 9.87504 12.9998 9.87504H11.1248V8.00002Z'
									fill='currentColor'
								/>
							</svg>
						</span>
						Set API Key
					</button>
				</div>
			</Card>

			<SetApiKeyModal showModal={showModal} setShowModal={setShowModal} />
		</>
	);
}
