import FormButton from "@/components/Common/Dashboard/FormButton";
import InputGroup from "@/components/Common/Dashboard/InputGroup";
import ModalCloseButton from "@/components/Common/Modals/ModalCloseButton";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function SetApiKeyModal(props: any) {
	const { showModal, setShowModal } = props;
	const [apiKey, setApiKey] = useState("");
	// const [isDisabled, setIsDisabled] = useState(true);

	const router = useRouter();

	// ===== click outside of dropdown =====
	const divRef = useRef<HTMLDivElement | null>(null);

	const handleSubmit = (e: any) => {
		e.preventDefault();

		if (apiKey) {
			localStorage.setItem("apiKey", apiKey);
			setShowModal(false);
			router.refresh();
		}
	};

	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleClickOutside = (event: MouseEvent) => {
				if (divRef.current && !divRef.current.contains(event.target as Node)) {
					setShowModal(false);
				}
			};

			document.addEventListener("mousedown", handleClickOutside);
			return () => {
				document.removeEventListener("mousedown", handleClickOutside);
			};
		}
	});
	return (
		<>
			{showModal && (
				<div
					className={`py-7.6 fixed left-0 top-0 z-[9999] flex h-screen w-full items-center justify-center bg-black/90 px-4 dark:bg-dark/70 sm:px-8`}
				>
					<div
						ref={divRef}
						className='shadow-7 relative h-auto max-h-[calc(100vh-60px)] w-full max-w-[600px] scale-100 transform overflow-y-auto rounded-[25px] bg-white transition-all dark:bg-black'
					>
						<ModalCloseButton closeModal={setShowModal} />

						<div className='flex flex-wrap gap-5.5 border-stroke p-4 text-center sm:p-7.5 xl:p-10'>
							<div className='mx-auto w-full max-w-[450px]'>
								<div className='mb-6 flex justify-center'>
									<svg
										width='120'
										height='119'
										viewBox='0 0 120 119'
										fill='none'
										xmlns='http://www.w3.org/2000/svg'
									>
										<circle
											opacity='0.08'
											cx='60'
											cy='59.5'
											r='59.5'
											fill='url(#paint0_linear_2175_14974)'
										/>
										<circle
											opacity='0.15'
											cx='60.0014'
											cy='59.5016'
											r='49.98'
											fill='url(#paint1_linear_2175_14974)'
										/>
										<path
											fillRule='evenodd'
											clipRule='evenodd'
											d='M74.5356 66.3133C80.1548 60.6941 80.1548 51.5836 74.5356 45.9644C68.9164 40.3452 59.8059 40.3452 54.1867 45.9644C50.4556 49.6955 49.2019 54.966 50.4257 59.7315C50.623 60.5001 50.4477 61.3313 49.8866 61.8924L42.1531 69.6259C41.4908 70.2882 41.1654 71.2157 41.2689 72.1467L41.7524 76.4979C41.8039 76.9618 42.0118 77.3943 42.3418 77.7244L42.7756 78.1582C43.1057 78.4882 43.5382 78.6961 44.0021 78.7477L48.3533 79.2311C49.2843 79.3346 50.2118 79.0092 50.8741 78.3469L52.3533 76.8677L48.7155 73.2696C48.1019 72.6628 48.0965 71.6735 48.7033 71.06C49.3102 70.4464 50.2995 70.441 50.913 71.0478L54.563 74.6579L58.6082 70.6128C59.1693 70.0517 59.9999 69.877 60.7685 70.0743C65.534 71.2981 70.8045 70.0445 74.5356 66.3133ZM61.2204 53.3871C62.8476 51.7599 65.4858 51.7599 67.1129 53.3871C68.7401 55.0142 68.7401 57.6524 67.1129 59.2796C65.4858 60.9068 62.8476 60.9068 61.2204 59.2796C59.5932 57.6524 59.5932 55.0142 61.2204 53.3871Z'
											fill='#635BFF'
										/>
										<defs>
											<linearGradient
												id='paint0_linear_2175_14974'
												x1='60'
												y1='0'
												x2='60'
												y2='119'
												gradientUnits='userSpaceOnUse'
											>
												<stop stopColor='#5750F1' stopOpacity='0' />
												<stop offset='1' stopColor='#5750F1' />
											</linearGradient>
											<linearGradient
												id='paint1_linear_2175_14974'
												x1='60.0014'
												y1='9.52161'
												x2='60.0014'
												y2='109.482'
												gradientUnits='userSpaceOnUse'
											>
												<stop stopColor='#5750F1' />
												<stop offset='1' stopColor='#5750F1' stopOpacity='0' />
											</linearGradient>
										</defs>
									</svg>
								</div>

								<div>
									<h2 className='mb-2 text-xl font-bold text-dark dark:text-white sm:text-heading-6'>
										Enter your OpenAI API Key
									</h2>
									<p className='mb-7 text-body'>
										To access the capabilities of AI Tools Template, a valid
										OpenAI API Key is required.
									</p>
								</div>

								<form onSubmit={handleSubmit} className='mb-7.5 space-y-4.5'>
									<InputGroup
										name='API Key'
										label='API Key'
										type='text'
										handleChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setApiKey(e.target.value)
										}
										value={apiKey}
										required={true}
										placeholder='API-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
									/>

									<FormButton>Set API Key</FormButton>
								</form>

								<div>
									<Link
										href='https://platform.openai.com/api-keys'
										target='_blank'
										rel='noopener noreferrer'
										className='tracking-[-.16px] text-body underline underline-offset-1 hover:text-primary'
									>
										Get your API key from Open AI
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
