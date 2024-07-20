import { useEffect, useRef } from "react";
import ModalCloseButton from "./ModalCloseButton";
import Loader from "../Loader";

export default function DeleteModal(props: any) {
	const {
		showDeleteModal,
		setShowDeleteModal,
		deleteText,
		handleDelete,
		loading,
	} = props;

	// ===== click outside of dropdown =====
	const divRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (typeof window !== "undefined") {
			const handleClickOutside = (event: MouseEvent) => {
				if (divRef.current && !divRef.current.contains(event.target as Node)) {
					setShowDeleteModal(false);
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
			{showDeleteModal && (
				<div
					className={`py-7.6 fixed left-0 top-0 z-99999 flex h-screen w-full items-center justify-center bg-black/90 px-4 dark:bg-dark/70 sm:px-8 `}
				>
					<div
						ref={divRef}
						className='shadow-7 relative h-auto max-h-[calc(100vh-60px)] w-full max-w-[600px] scale-100 transform overflow-y-auto rounded-[25px] bg-white transition-all dark:bg-black'
					>
						<ModalCloseButton closeModal={setShowDeleteModal} />

						<div className='flex flex-wrap gap-5.5 border-b border-stroke p-4 dark:border-stroke-dark sm:p-7.5 xl:p-10'>
							<div className='flex h-16.5 w-16.5 items-center justify-center rounded-lg bg-red-light-6'>
								<svg
									width='38'
									height='39'
									viewBox='0 0 38 39'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M12.4182 6.52003C15.6303 4.6178 17.2364 3.66669 19 3.66669C20.7636 3.66669 22.3697 4.6178 25.5818 6.52003L26.6682 7.16341C29.8803 9.06564 31.4864 10.0168 32.3682 11.5834C33.25 13.15 33.25 15.0522 33.25 18.8566V20.1434C33.25 23.9479 33.25 25.8501 32.3682 27.4167C31.4864 28.9833 29.8803 29.9344 26.6682 31.8366L25.5818 32.48C22.3697 34.3822 20.7636 35.3334 19 35.3334C17.2364 35.3334 15.6303 34.3822 12.4182 32.48L11.3318 31.8366C8.11965 29.9344 6.51359 28.9833 5.63179 27.4167C4.75 25.8501 4.75 23.9479 4.75 20.1434V18.8566C4.75 15.0522 4.75 13.15 5.63179 11.5834C6.51359 10.0168 8.11965 9.06564 11.3318 7.16341L12.4182 6.52003ZM20.5833 25.8334C20.5833 26.7078 19.8745 27.4167 19 27.4167C18.1255 27.4167 17.4167 26.7078 17.4167 25.8334C17.4167 24.9589 18.1255 24.25 19 24.25C19.8745 24.25 20.5833 24.9589 20.5833 25.8334ZM19 10.3959C19.6558 10.3959 20.1875 10.9275 20.1875 11.5834V21.0834C20.1875 21.7392 19.6558 22.2709 19 22.2709C18.3442 22.2709 17.8125 21.7392 17.8125 21.0834V11.5834C17.8125 10.9275 18.3442 10.3959 19 10.3959Z'
										fill='#E10E0E'
									/>
								</svg>
							</div>

							<div className='text-left'>
								<h2 className='mb-2 text-xl font-bold text-black dark:text-white sm:text-heading-6'>
									{/* Delete Template */}
									{deleteText}
								</h2>
								<p className='text-custom-sm font-medium'>
									Are you sure about that? this can not be undone
								</p>
							</div>
						</div>

						<div className='flex items-center justify-end gap-3 p-4 sm:p-4.5'>
							<button
								onClick={handleDelete}
								className='bg-input inline-flex items-center rounded-lg border border-stroke px-7 py-2 font-medium duration-200 ease-out hover:bg-slate-100 dark:border-stroke-dark dark:bg-white/40 dark:text-white dark:hover:bg-white/35'
							>
								<svg
									width='16'
									height='17'
									viewBox='0 0 16 17'
									fill='currentColor'
									xmlns='http://www.w3.org/2000/svg'
									className='mr-2'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M6.59146 0.374985H9.40933C9.58966 0.37487 9.74676 0.37477 9.89511 0.398459C10.4812 0.492048 10.9884 0.857592 11.2625 1.384C11.3319 1.51724 11.3814 1.66631 11.4384 1.83742L11.5314 2.1165C11.5471 2.16374 11.5516 2.17712 11.5554 2.18765C11.7014 2.59108 12.0797 2.8638 12.5086 2.87467C12.5199 2.87495 12.5337 2.875 12.5837 2.875H15.0837C15.4289 2.875 15.7087 3.15482 15.7087 3.5C15.7087 3.84518 15.4289 4.125 15.0837 4.125H0.916992C0.571814 4.125 0.291992 3.84518 0.291992 3.5C0.291992 3.15482 0.571814 2.875 0.916992 2.875H3.41706C3.4671 2.875 3.48091 2.87495 3.49219 2.87467C3.92106 2.8638 4.29941 2.5911 4.44534 2.18767C4.44918 2.17706 4.45359 2.16398 4.46942 2.1165L4.56242 1.83744C4.61934 1.66634 4.66893 1.51725 4.73831 1.384C5.01243 0.857593 5.5196 0.492048 6.10568 0.398459C6.25403 0.37477 6.41113 0.37487 6.59146 0.374985ZM5.50712 2.875C5.55004 2.79082 5.58808 2.70334 5.62081 2.61287C5.63074 2.5854 5.64049 2.55615 5.65301 2.51858L5.73618 2.26907C5.81215 2.04115 5.82965 1.99466 5.847 1.96134C5.93837 1.78587 6.10743 1.66402 6.30279 1.63282C6.33989 1.6269 6.38952 1.625 6.62978 1.625H9.37101C9.61127 1.625 9.66089 1.6269 9.698 1.63282C9.89336 1.66402 10.0624 1.78587 10.1538 1.96133C10.1711 1.99466 10.1886 2.04114 10.2646 2.26907L10.3477 2.51843L10.38 2.61289C10.4127 2.70335 10.4507 2.79082 10.4937 2.875H5.50712Z'
										fill='currentColor'
									/>
									<path
										d='M2.92957 5.54176C2.90661 5.19735 2.60879 4.93676 2.26438 4.95972C1.91996 4.98268 1.65937 5.2805 1.68234 5.62491L2.06854 11.418C2.13979 12.487 2.19734 13.3504 2.33232 14.028C2.47265 14.7324 2.71133 15.3208 3.20433 15.782C3.69732 16.2432 4.30028 16.4423 5.01249 16.5354C5.69751 16.625 6.56286 16.625 7.63416 16.625H8.36658C9.43787 16.625 10.3033 16.625 10.9883 16.5354C11.7005 16.4423 12.3035 16.2432 12.7965 15.782C13.2895 15.3208 13.5281 14.7324 13.6685 14.028C13.8034 13.3504 13.861 12.487 13.9322 11.418L14.3185 5.62491C14.3414 5.2805 14.0808 4.98268 13.7364 4.95972C13.392 4.93676 13.0942 5.19735 13.0712 5.54176L12.6879 11.291C12.6131 12.4142 12.5597 13.1958 12.4426 13.7838C12.3289 14.3541 12.1703 14.6561 11.9425 14.8692C11.7146 15.0824 11.4028 15.2205 10.8262 15.296C10.2317 15.3737 9.44833 15.375 8.32263 15.375H7.67816C6.55246 15.375 5.76912 15.3737 5.17462 15.296C4.59795 15.2205 4.28615 15.0824 4.05831 14.8692C3.83046 14.6561 3.67185 14.3541 3.55823 13.7838C3.44109 13.1957 3.38773 12.4142 3.31285 11.291L2.92957 5.54176Z'
										fill='currentColor'
									/>
									<path
										d='M5.85488 7.04477C6.19834 7.01042 6.50462 7.26101 6.53897 7.60448L6.95563 11.7711C6.98998 12.1146 6.73939 12.4209 6.39592 12.4552C6.05246 12.4896 5.74618 12.239 5.71184 11.8955L5.29517 7.72886C5.26082 7.38539 5.51141 7.07912 5.85488 7.04477Z'
										fill='currentColor'
									/>
									<path
										d='M10.1459 7.04477C10.4894 7.07912 10.74 7.38539 10.7056 7.72886L10.289 11.8955C10.2546 12.239 9.94834 12.4896 9.60488 12.4552C9.26141 12.4209 9.01082 12.1146 9.04517 11.7711L9.46184 7.60448C9.49618 7.26101 9.80246 7.01042 10.1459 7.04477Z'
										fill='currentColor'
									/>
								</svg>

								{!loading ? (
									"Delete"
								) : (
									<>
										<span className='mr-2'>Deleting</span>
										<Loader style='border-dark dark:border-white' />
									</>
								)}
							</button>
							<button
								onClick={() => setShowDeleteModal(false)}
								className=' inline-flex items-center rounded-lg bg-black px-7 py-2 font-medium text-white duration-200 ease-out hover:bg-slate-700 dark:bg-white dark:text-dark dark:hover:bg-white/90'
							>
								<svg
									width='20'
									height='21'
									viewBox='0 0 20 21'
									fill='currentColor'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M11.0082 10.5L14.7915 6.71666C15.0665 6.44166 15.0665 5.98333 14.7915 5.70833C14.657 5.57611 14.476 5.50201 14.2874 5.50201C14.0988 5.50201 13.9177 5.57611 13.7832 5.70833L9.99987 9.49166L6.21654 5.70833C6.08204 5.57611 5.90098 5.50201 5.71237 5.50201C5.52376 5.50201 5.3427 5.57611 5.2082 5.70833C4.9332 5.98333 4.9332 6.44166 5.2082 6.71666L8.99154 10.5L5.2082 14.2833C4.9332 14.5583 4.9332 15.0167 5.2082 15.2917C5.4832 15.5667 5.94154 15.5667 6.21654 15.2917L9.99987 11.5083L13.7832 15.2917C14.0582 15.5667 14.5165 15.5667 14.7915 15.2917C15.0665 15.0167 15.0665 14.5583 14.7915 14.2833L11.0082 10.5Z'
										fill='currentColor'
									/>
								</svg>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
