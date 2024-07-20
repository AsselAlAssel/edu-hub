"use client";
import React from "react";
import Breadcrumbs from "../Common/Breadcrumbs";
import Image from "next/image";

const Support = () => {
	return (
		<section className='lg:ub-pb-22.5 overflow-hidden pb-17.5 pt-35 xl:pb-27.5'>
			{/* <!-- ===== Breadcrumb Section Start ===== --> */}
			<Breadcrumbs title={"Support"} pages={["Home", "Support"]} />
			{/* <!-- ===== Breadcrumb Section End ===== --> */}

			<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
				<div className='flex flex-col overflow-hidden rounded-[20px] bg-gray-1 dark:bg-black md:flex-row'>
					<div className='w-full px-4 py-16 sm:px-7.5 lg:px-10 xl:px-16'>
						<form>
							<div className='mb-5 w-full'>
								<label
									htmlFor='fullName'
									className='mb-2.5 block font-satoshi font-medium -tracking-[0.2px] text-dark dark:text-white'
								>
									Full Name
								</label>

								<input
									type='text'
									name='fullName'
									id='fullName'
									placeholder='Enter your full name'
									className='w-full rounded-[10px] border border-stroke bg-white px-6 py-3 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-black'
								/>
							</div>

							<div className='mb-5 w-full'>
								<label
									htmlFor='email'
									className='mb-2.5 block font-satoshi font-medium -tracking-[0.2px] text-dark dark:text-white'
								>
									Email
								</label>

								<input
									type='email'
									name='email'
									id='email'
									placeholder='Enter your Email'
									className='w-full rounded-[10px] border border-stroke bg-white px-6 py-3 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-black'
								/>
							</div>

							<div className='mb-7.5'>
								<label
									htmlFor='message'
									className='mb-2.5 block font-satoshi font-medium -tracking-[0.2px] text-dark dark:text-white'
								>
									Message
								</label>

								<textarea
									name='message'
									id='message'
									rows={5}
									placeholder='Type your message'
									className='w-full rounded-[10px] border border-stroke bg-white px-6 py-3 outline-none duration-200 placeholder:text-dark-5 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-primary/20 dark:border-stroke-dark dark:bg-black'
								></textarea>
							</div>

							<button
								type='submit'
								className='flex w-full justify-center rounded-full bg-primary p-[13px] font-satoshi font-medium text-white duration-200 ease-out hover:bg-primary-dark'
							>
								Send Message
							</button>
						</form>
					</div>

					<div className='relative z-1 flex w-full max-w-[570px] items-center justify-center bg-black p-4 py-15 sm:p-7.5'>
						{/* <!-- bg shapes --> */}
						<div>
							<div className='absolute bottom-0 left-0 -z-1'>
								<Image
									src='/images/support/support-grid-01.svg'
									alt='grid'
									width={364}
									height={364}
								/>
							</div>
							<div className='absolute right-0 top-0 -z-1'>
								<Image
									src='/images/support/support-grid-02.svg'
									alt='grid'
									width={368}
									height={368}
								/>
							</div>
							<div className='absolute bottom-0 left-0 -z-1'>
								<Image
									src='/images/support/support-shape-01.svg'
									alt='shape'
									width={343}
									height={391}
								/>
							</div>
							<div className='absolute right-0 top-0 -z-1'>
								<Image
									src='/images/support/support-shape-02.svg'
									alt='shape'
									width={421}
									height={538}
								/>
							</div>
						</div>

						<div>
							<h2 className='mb-5 max-w-[357px] font-satoshi text-custom-3xl font-bold -tracking-[1.3px] text-white'>
								Need any help? Just open a support ticket
							</h2>
							<p className='max-w-[270px] text-gray-5'>
								Our support team will get back to as soon as they can.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Support;
