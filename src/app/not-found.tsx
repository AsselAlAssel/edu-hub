import NotFound from "@/components/404";

// Rendered outside the site shell (unmatched URLs), so it owns the <main> landmark.
export default function NotFoundPage() {
	return (
		<main
			id='main-content'
			style={{ flex: 1, display: "flex", flexDirection: "column" }}
		>
			<NotFound />
		</main>
	);
}
