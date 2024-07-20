import React from "react";
import { getPostBySlug, imageBuilder } from "@/sanity/sanity-utils";
import RenderBodyContent from "@/components/Blog/RenderBodyContent";
import Link from "next/link";
import Image from "next/image";
import { structuredAlgoliaHtmlData } from "@/libs/crawlIndex";
import CopyToClipboard from "@/components/Common/CopyToClipboard";
import SocialShare from "@/components/Blog/SocialShare";

type Props = {
	params: {
		slug: string;
	};
};

export async function generateMetadata({ params }: Props) {
	const { slug } = params;
	const post = await getPostBySlug(slug);
	const siteURL = process.env.SITE_URL;
	const authorName = process.env.AUTHOR_NAME;

	if (post) {
		return {
			title: `${
				post.title || "Single Post Page"
			} | ${authorName} - Next.js SaaS Starter Kit`,
			description: `${post.metadata?.slice(0, 136)}...`,
			author: authorName,
			alternates: {
				canonical: `${siteURL}/blog/${post?.slug?.current}`,
				languages: {
					"en-US": "/en-US",
					"de-DE": "/de-DE",
				},
			},

			robots: {
				index: true,
				follow: true,
				nocache: true,
				googleBot: {
					index: true,
					follow: false,
					"max-video-preview": -1,
					"max-image-preview": "large",
					"max-snippet": -1,
				},
			},

			openGraph: {
				title: `${post.title} | ${authorName}`,
				description: post.metadata,
				url: `${siteURL}/blog/${post?.slug?.current}`,
				siteName: authorName,
				images: [
					{
						url: imageBuilder(post.mainImage).url(),
						width: 1800,
						height: 1600,
						alt: post.title,
					},
				],
				locale: "en_US",
				type: "article",
			},

			twitter: {
				card: "summary_large_image",
				title: `${post.title} | ${authorName}`,
				description: `${post.metadata?.slice(0, 136)}...`,
				creator: `@${authorName}`,
				site: `@${authorName}`,
				images: [imageBuilder(post?.mainImage).url()],
				url: `${siteURL}/blog/${post?.slug?.current}`,
			},
		};
	} else {
		return {
			title: "Not Found",
			description: "No blog article has been found",
		};
	}
}

const SingleBlog = async ({ params }: Props) => {
	const { slug } = params;
	const post = await getPostBySlug(slug);
	const postURL = `${process.env.SITE_URL}blog/${post?.slug?.current}`;

	await structuredAlgoliaHtmlData({
		type: "blog",
		title: post?.title || "",
		htmlString: post?.metadata || "",
		pageUrl: `${process.env.SITE_URL}/blog/${post?.slug?.current}`,
		imageURL: imageBuilder(post?.mainImage).url() as string,
	});

	return (
		<main>
			{/* <!-- ===== Blog Details Section Start ===== --> */}
			<section className='lg:ub-pb-22.5 relative z-1 overflow-hidden pb-17.5 pt-35 xl:pb-27.5'>
				{/* <!-- bg shapes --> */}
				<div>
					<div className='absolute left-0 top-0 -z-1'>
						<Image
							src='/images/blog/blog-shape-01.svg'
							alt='shape'
							width={340}
							height={680}
						/>
					</div>
					<div className='absolute right-0 top-0 -z-1'>
						<Image
							src='/images/blog/blog-shape-02.svg'
							alt='shape'
							width={425}
							height={672}
						/>
					</div>
				</div>

				<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
					<div className='mx-auto mb-12.5 w-full max-w-[770px] text-center'>
						<div className='mb-5 flex flex-wrap items-center justify-center gap-6'>
							<Link
								href={`/blog/author/${post?.author?.slug?.current}`}
								className='flex items-center gap-2 font-satoshi font-medium -tracking-[0.2px] text-black dark:text-gray-5'
							>
								<svg
									className='fill-current'
									width='21'
									height='20'
									viewBox='0 0 21 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M10.3245 1.0415C8.13837 1.0415 6.36616 2.81371 6.36616 4.99984C6.36616 7.18596 8.13837 8.95817 10.3245 8.95817C12.5106 8.95817 14.2828 7.18596 14.2828 4.99984C14.2828 2.81371 12.5106 1.0415 10.3245 1.0415ZM7.61616 4.99984C7.61616 3.50407 8.82872 2.2915 10.3245 2.2915C11.8203 2.2915 13.0328 3.50407 13.0328 4.99984C13.0328 6.49561 11.8203 7.70817 10.3245 7.70817C8.82872 7.70817 7.61616 6.49561 7.61616 4.99984Z'
									/>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M10.3245 10.2082C8.39653 10.2082 6.62026 10.6464 5.30403 11.3868C4.0074 12.1161 3.03283 13.2216 3.03283 14.5832L3.03277 14.6681C3.03183 15.6363 3.03065 16.8515 4.0965 17.7195C4.62106 18.1466 5.35489 18.4504 6.34633 18.6511C7.34054 18.8523 8.63635 18.9582 10.3245 18.9582C12.0126 18.9582 13.3084 18.8523 14.3027 18.6511C15.2941 18.4504 16.0279 18.1466 16.5525 17.7195C17.6183 16.8515 17.6172 15.6363 17.6162 14.6681L17.6162 14.5832C17.6162 13.2216 16.6416 12.1161 15.345 11.3868C14.0287 10.6464 12.2525 10.2082 10.3245 10.2082ZM4.28283 14.5832C4.28283 13.8737 4.80064 13.1041 5.91686 12.4763C7.01349 11.8594 8.57055 11.4582 10.3245 11.4582C12.0784 11.4582 13.6355 11.8594 14.7321 12.4763C15.8483 13.1041 16.3662 13.8737 16.3662 14.5832C16.3662 15.673 16.3326 16.2865 15.7632 16.7502C15.4544 17.0016 14.9382 17.2471 14.0547 17.4259C13.1739 17.6042 11.9697 17.7082 10.3245 17.7082C8.67931 17.7082 7.47511 17.6042 6.59432 17.4259C5.71076 17.2471 5.19459 17.0016 4.88582 16.7502C4.31642 16.2865 4.28283 15.673 4.28283 14.5832Z'
									/>
								</svg>
								{post?.author?.name.charAt(0).toUpperCase() +
									post?.author?.name.slice(1).toLowerCase()}
							</Link>

							<Link
								href={`/blog/author/${post?.author?.slug?.current}`}
								className='flex items-center gap-2 font-satoshi font-medium -tracking-[0.2px] text-black dark:text-gray-5'
							>
								<svg
									className='fill-current'
									width='21'
									height='20'
									viewBox='0 0 21 20'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path d='M14.4912 11.6668C14.9514 11.6668 15.3245 11.2937 15.3245 10.8335C15.3245 10.3733 14.9514 10.0002 14.4912 10.0002C14.031 10.0002 13.6579 10.3733 13.6579 10.8335C13.6579 11.2937 14.031 11.6668 14.4912 11.6668Z' />
									<path d='M14.4912 15.0002C14.9514 15.0002 15.3245 14.6271 15.3245 14.1668C15.3245 13.7066 14.9514 13.3335 14.4912 13.3335C14.031 13.3335 13.6579 13.7066 13.6579 14.1668C13.6579 14.6271 14.031 15.0002 14.4912 15.0002Z' />
									<path d='M11.1579 10.8335C11.1579 11.2937 10.7848 11.6668 10.3245 11.6668C9.86431 11.6668 9.49121 11.2937 9.49121 10.8335C9.49121 10.3733 9.86431 10.0002 10.3245 10.0002C10.7848 10.0002 11.1579 10.3733 11.1579 10.8335Z' />
									<path d='M11.1579 14.1668C11.1579 14.6271 10.7848 15.0002 10.3245 15.0002C9.86431 15.0002 9.49121 14.6271 9.49121 14.1668C9.49121 13.7066 9.86431 13.3335 10.3245 13.3335C10.7848 13.3335 11.1579 13.7066 11.1579 14.1668Z' />
									<path d='M6.15788 11.6668C6.61812 11.6668 6.99121 11.2937 6.99121 10.8335C6.99121 10.3733 6.61812 10.0002 6.15788 10.0002C5.69764 10.0002 5.32454 10.3733 5.32454 10.8335C5.32454 11.2937 5.69764 11.6668 6.15788 11.6668Z' />
									<path d='M6.15788 15.0002C6.61812 15.0002 6.99121 14.6271 6.99121 14.1668C6.99121 13.7066 6.61812 13.3335 6.15788 13.3335C5.69764 13.3335 5.32454 13.7066 5.32454 14.1668C5.32454 14.6271 5.69764 15.0002 6.15788 15.0002Z' />
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M6.15788 1.4585C6.50306 1.4585 6.78288 1.73832 6.78288 2.0835V2.7191C7.33454 2.70848 7.94232 2.70849 8.61076 2.7085H12.0382C12.7067 2.70849 13.3145 2.70848 13.8662 2.7191V2.0835C13.8662 1.73832 14.146 1.4585 14.4912 1.4585C14.8364 1.4585 15.1162 1.73832 15.1162 2.0835V2.77274C15.3328 2.78925 15.538 2.81001 15.7321 2.83611C16.7091 2.96746 17.4999 3.24423 18.1235 3.86787C18.7471 4.4915 19.0239 5.28229 19.1553 6.25931C19.2829 7.20865 19.2829 8.42166 19.2829 9.95312V11.7138C19.2829 13.2453 19.2829 14.4583 19.1553 15.4077C19.0239 16.3847 18.7471 17.1755 18.1235 17.7991C17.4999 18.4228 16.7091 18.6995 15.7321 18.8309C14.7827 18.9585 13.5697 18.9585 12.0383 18.9585H8.61087C7.07942 18.9585 5.86636 18.9585 4.91703 18.8309C3.94001 18.6995 3.14922 18.4228 2.52558 17.7991C1.90194 17.1755 1.62518 16.3847 1.49382 15.4077C1.36619 14.4583 1.3662 13.2453 1.36621 11.7138V9.95315C1.3662 8.42168 1.36619 7.20865 1.49382 6.25931C1.62518 5.28229 1.90194 4.4915 2.52558 3.86787C3.14922 3.24423 3.94001 2.96746 4.91703 2.83611C5.11113 2.81001 5.31626 2.78925 5.53288 2.77274V2.0835C5.53288 1.73832 5.8127 1.4585 6.15788 1.4585ZM5.08359 4.07496C4.24518 4.18768 3.76214 4.39907 3.40946 4.75175C3.05679 5.10442 2.8454 5.58746 2.73268 6.42587C2.71359 6.56786 2.69763 6.71734 2.68428 6.87516H17.9648C17.9515 6.71734 17.9355 6.56786 17.9164 6.42587C17.8037 5.58746 17.5923 5.10442 17.2396 4.75175C16.887 4.39907 16.4039 4.18768 15.5655 4.07496C14.7091 3.95982 13.5802 3.9585 11.9912 3.9585H8.65788C7.06886 3.9585 5.93997 3.95982 5.08359 4.07496ZM2.61621 10.0002C2.61621 9.28848 2.61648 8.6691 2.62712 8.12516H18.022C18.0326 8.6691 18.0329 9.28848 18.0329 10.0002V11.6668C18.0329 13.2558 18.0316 14.3847 17.9164 15.2411C17.8037 16.0795 17.5923 16.5626 17.2396 16.9152C16.8869 17.2679 16.4039 17.4793 15.5655 17.592C14.7091 17.7072 13.5802 17.7085 11.9912 17.7085H8.65788C7.06886 17.7085 5.93997 17.7072 5.08358 17.592C4.24518 17.4793 3.76214 17.2679 3.40946 16.9152C3.05679 16.5626 2.8454 16.0795 2.73268 15.2411C2.61754 14.3847 2.61621 13.2558 2.61621 11.6668V10.0002Z'
									/>
								</svg>
								{new Date(post?.publishedAt as string)
									.toDateString()
									.split(" ")
									.slice(1)
									.join(" ")}
							</Link>
						</div>
						<h2 className='mb-5.5 font-satoshi text-3xl font-bold -tracking-[1.6px] text-black dark:text-white lg:text-heading-4 xl:text-heading-3'>
							{post.title}
						</h2>

						<p className='dark:text-gray-5'>{post.metadata}</p>
					</div>

					<div className='mb-12.5 overflow-hidden rounded-[15px]'>
						<Image
							className='rounded-[15px]'
							src={imageBuilder(post.mainImage).url() as string}
							alt={post.title}
							width={1170}
							height={540}
						/>
					</div>

					<div className='mx-auto w-full max-w-[770px]'>
						<div className='blog-details'>
							<RenderBodyContent post={post as any} />
						</div>

						<div className='mt-10 flex flex-wrap items-center justify-between gap-10 border-t border-stroke pt-9 dark:border-stroke-dark'>
							<div className='flex items-center gap-5'>
								<div className='h-15 w-full max-w-[60px] overflow-hidden rounded-full'>
									<Link href={`/blog/author/${post?.author?.slug?.current}`}>
										<Image
											src={imageBuilder(post?.author?.image).url() as string}
											alt={post?.author?.name}
											width={60}
											height={60}
										/>
									</Link>
								</div>

								<div className='w-full'>
									<Link
										href={`/blog/author/${post?.author?.slug?.current}`}
										className='block font-satoshi text-lg font-medium capitalize text-black dark:text-white'
									>
										{post?.author?.name}
									</Link>
									<span className='block dark:text-gray-5'>
										{" "}
										{post?.author?.bio}{" "}
									</span>
								</div>
							</div>

							{/* <!-- Social Links start --> */}
							<div className='flex items-center gap-3'>
								<CopyToClipboard text={postURL} label='Copy Link' />

								<SocialShare url={postURL} />
							</div>
							{/* <!-- Social Links end --> */}
						</div>
					</div>
				</div>
			</section>
		</main>
	);
};

export default SingleBlog;
