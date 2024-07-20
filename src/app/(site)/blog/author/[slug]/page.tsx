import { getPostsByAuthor, getAuthorBySlug } from "@/sanity/sanity-utils";
import BlogItem from "@/components/Blog/BlogItem";
import Breadcrumbs from "@/components/Common/Breadcrumbs";
import { Author } from "@/types/blog";
import Image from "next/image";
import { imageBuilder } from "@/sanity/sanity-utils";

type Props = {
	params: {
		slug: string;
	};
};

export async function generateMetadata({ params }: Props) {
	const { slug } = params;
	const author = (await getAuthorBySlug(slug)) as Author;
	const siteURL = process.env.SITE_URL;
	const authorName = process.env.AUTHOR_NAME;

	if (author) {
		return {
			title: `${
				author.name || "Author Page"
			} | ${authorName} - Next.js SaaS Starter Kit`,
			description: author.bio,
			author: authorName,

			robots: {
				index: false,
				follow: false,
				nocache: true,
			},

			openGraph: {
				title: `${author.name} | ${authorName}`,
				description: author.bio,
				url: `${siteURL}/blog/author/${slug}`,
				siteName: authorName,
				images: [
					{
						url: imageBuilder(author.image).url(),
						width: 343,
						height: 343,
						alt: author.name,
					},
				],
				locale: "en_US",
				type: "article",
			},

			twitter: {
				card: "summary_large_image",
				title: `${author.name} | ${authorName}`,
				description: `${author.bio?.slice(0, 136)}...`,
				creator: `@${authorName}`,
				site: `@${authorName}`,
				images: [imageBuilder(author.image).url()],
				url: `${siteURL}/blog/author/${slug}`,
			},
		};
	} else {
		return {
			title: "Not Found",
			description: "No Author Found has been found",
		};
	}
}

const BlogGrid = async ({ params }: Props) => {
	const { slug } = params;

	const posts = await getPostsByAuthor(slug);
	const author = (await getAuthorBySlug(slug)) as Author;

	return (
		<main>
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
							height={682}
						/>
					</div>
				</div>

				<Breadcrumbs title={author?.name} pages={["Home", author?.name]} />

				<div className='mx-auto w-full max-w-[1170px] px-4 sm:px-8 xl:px-0'>
					<div className='grid grid-cols-1 gap-x-7.5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3'>
						{/* Blog Item */}
						{posts?.length > 0 ? (
							posts?.map((item, key) => <BlogItem key={key} blog={item} />)
						) : (
							<p>No posts available!</p>
						)}
					</div>
				</div>
			</section>
		</main>
	);
};

export default BlogGrid;
