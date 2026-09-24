import NotFound from "@/components/404";

// notFound() inside site pages (e.g. unknown class/folder) keeps header and footer.
export default function SiteNotFound() {
	return <NotFound />;
}
