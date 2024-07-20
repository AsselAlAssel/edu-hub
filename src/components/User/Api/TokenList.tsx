"use client";
import CopyToClipboard from "@/components/Common/CopyToClipboard";
import DeleteModal from "@/components/Common/Modals/DeleteModal";
import { useState } from "react";
import { ApiKey } from "@prisma/client";
import { deleteApiKey } from "@/actions/api-key";
import toast from "react-hot-toast";

export default function TokenList({ tokens }: { tokens: ApiKey[] }) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [loading, setLodading] = useState(false);
	const [id, setId] = useState("");

	const handleDelete = async () => {
		setLodading(true);
		try {
			await deleteApiKey(id);
		} catch (error) {
			toast.error("Failed to delete token");
		}

		setLodading(false);
		setShowDeleteModal(false);
	};

	return (
		<>
			<div className='rounded-10 bg-white shadow-1 dark:bg-gray-dark lg:w-3/5'>
				{tokens.length > 0 && (
					<>
						<div className='border-b border-stroke px-9 py-5 dark:border-stroke-dark'>
							<h3 className='font-satoshi text-custom-2xl font-bold tracking-[-.5px] text-dark dark:text-white'>
								List of active tokens
							</h3>
						</div>
						<table className='w-full'>
							<thead className='border-b border-stroke dark:border-stroke-dark'>
								<tr>
									<th className='p-3 pl-9 text-left font-satoshi text-base font-medium text-body dark:text-gray-5'>
										Name
									</th>
									<th className='hidden p-3 text-left font-satoshi text-base font-medium text-body dark:text-gray-5 md:table-cell'>
										Date
									</th>
									<th className='p-3 pr-9 text-right font-satoshi text-base font-medium text-body dark:text-gray-5'>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{tokens?.map((token) => (
									<tr
										key={token?.id}
										className='border-b border-stroke last-of-type:border-b-0 dark:border-stroke-dark'
									>
										<td className='p-4.5 pl-9 text-left tracking-[-.16px] text-dark dark:text-white'>
											<span className='text-body dark:text-gray-5 md:hidden'>
												Name:{" "}
											</span>
											{token?.name}
											<span className='block md:hidden'>
												<span className='text-body dark:text-gray-5'>
													Date:{" "}
													{new Date(token?.createdAt).toLocaleDateString()}
												</span>
											</span>
										</td>
										<td className='hidden p-4.5 text-left tracking-[-.16px] text-dark dark:text-white md:table-cell'>
											{new Date(token?.createdAt).toLocaleDateString()}
										</td>
										<td className='p-4.5 pr-9 tracking-[-.16px] text-dark dark:text-white'>
											<div className='flex items-center justify-end gap-3.5'>
												{/* <DeleteToken id={token?.id} /> */}
												<button
													onClick={() => {
														setId(token?.id);
														setShowDeleteModal(true);
													}}
													className='flex h-10 items-center justify-center rounded-lg bg-red-light-5 px-3 text-red hover:bg-red hover:text-white dark:bg-red/10 dark:hover:bg-red'
												>
													<svg
														width='23'
														height='23'
														viewBox='0 0 23 23'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
													>
														<path
															fillRule='evenodd'
															clipRule='evenodd'
															d='M9.76438 2.11166H12.864C13.0624 2.11153 13.2352 2.11142 13.3984 2.13748C14.0431 2.24043 14.601 2.64253 14.9025 3.22158C14.9788 3.36814 15.0334 3.53212 15.096 3.72034L15.1983 4.02733C15.2156 4.07929 15.2206 4.094 15.2248 4.10559C15.3853 4.54936 15.8015 4.84935 16.2732 4.86131C16.2856 4.86162 16.3008 4.86168 16.3559 4.86168H19.1059C19.4856 4.86168 19.7934 5.16948 19.7934 5.54918C19.7934 5.92887 19.4856 6.23668 19.1059 6.23668H3.52246C3.14277 6.23668 2.83496 5.92887 2.83496 5.54918C2.83496 5.16948 3.14277 4.86168 3.52246 4.86168H6.27254C6.32758 4.86168 6.34277 4.86162 6.35517 4.86131C6.82694 4.84935 7.24312 4.54938 7.40365 4.10561C7.40787 4.09394 7.41272 4.07955 7.43013 4.02733L7.53244 3.72036C7.59504 3.53215 7.64959 3.36814 7.72591 3.22158C8.02745 2.64253 8.58533 2.24043 9.23002 2.13748C9.3932 2.11142 9.56602 2.11153 9.76438 2.11166ZM8.5716 4.86168C8.61882 4.76907 8.66066 4.67284 8.69666 4.57333C8.70759 4.54311 8.71831 4.51094 8.73208 4.46962L8.82357 4.19515C8.90714 3.94444 8.92638 3.8933 8.94547 3.85664C9.04598 3.66363 9.23194 3.52959 9.44684 3.49528C9.48765 3.48876 9.54224 3.48668 9.80653 3.48668H12.8219C13.0862 3.48668 13.1408 3.48876 13.1816 3.49528C13.3965 3.52959 13.5824 3.66363 13.6829 3.85664C13.702 3.8933 13.7213 3.94443 13.8048 4.19515L13.8963 4.46945L13.9318 4.57335C13.9678 4.67286 14.0096 4.76908 14.0568 4.86168H8.5716Z'
															fill='currentColor'
														/>
														<path
															d='M5.73629 7.79511C5.71104 7.41626 5.38344 7.12961 5.00458 7.15487C4.62573 7.18012 4.33908 7.50772 4.36434 7.88657L4.78917 14.259C4.86754 15.4348 4.93084 16.3846 5.07932 17.13C5.23368 17.9048 5.49623 18.5521 6.03853 19.0594C6.58083 19.5667 7.24408 19.7857 8.02751 19.8881C8.78103 19.9867 9.73292 19.9867 10.9113 19.9867H11.717C12.8954 19.9867 13.8474 19.9867 14.6009 19.8881C15.3843 19.7857 16.0476 19.5667 16.5899 19.0594C17.1322 18.5521 17.3947 17.9048 17.5491 17.13C17.6976 16.3846 17.7609 15.4349 17.8392 14.259L18.2641 7.88657C18.2893 7.50772 18.0027 7.18012 17.6238 7.15487C17.245 7.12961 16.9174 7.41626 16.8921 7.79511L16.4705 14.1193C16.3881 15.3548 16.3294 16.2145 16.2006 16.8613C16.0756 17.4887 15.9011 17.8208 15.6505 18.0553C15.3999 18.2898 15.0569 18.4418 14.4226 18.5248C13.7686 18.6103 12.9069 18.6117 11.6687 18.6117H10.9597C9.72147 18.6117 8.8598 18.6103 8.20585 18.5248C7.57152 18.4418 7.22854 18.2898 6.97791 18.0553C6.72728 17.8208 6.55281 17.4887 6.42782 16.8613C6.29897 16.2145 6.24027 15.3548 6.15791 14.1193L5.73629 7.79511Z'
															fill='currentColor'
														/>
														<path
															d='M8.95414 9.44842C9.33195 9.41064 9.66885 9.68629 9.70663 10.0641L10.165 14.6474C10.2027 15.0252 9.9271 15.3621 9.54929 15.3999C9.17148 15.4377 8.83457 15.1621 8.79679 14.7843L8.33846 10.2009C8.30068 9.82311 8.57632 9.4862 8.95414 9.44842Z'
															fill='currentColor'
														/>
														<path
															d='M13.6743 9.44842C14.0521 9.4862 14.3277 9.82311 14.29 10.2009L13.8316 14.7843C13.7939 15.1621 13.4569 15.4377 13.0791 15.3999C12.7013 15.3621 12.4257 15.0252 12.4635 14.6474L12.9218 10.0641C12.9596 9.68629 13.2965 9.41064 13.6743 9.44842Z'
															fill='currentColor'
														/>
													</svg>
												</button>

												<CopyToClipboard text={token.key} label='Copy' />
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</>
				)}
				<div>
					{tokens?.length === 0 && (
						<p className='flex justify-center px-9 py-20 tracking-[-.16px] text-body dark:text-gray-5'>
							No active token available!
						</p>
					)}
				</div>
			</div>

			<DeleteModal
				showDeleteModal={showDeleteModal}
				setShowDeleteModal={setShowDeleteModal}
				deleteText='Delete API Key'
				handleDelete={handleDelete}
				loading={loading}
			/>
		</>
	);
}
