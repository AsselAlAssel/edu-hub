import type { LandingPage } from "@prisma/client";
import AboutSection from "./components/AboutSection";
import ContactUs from "./components/ContactUs";
import FeaturesSection from "./components/FeaturesSection";
import Hero from "./components/Header";
import VideoSection from "./components/VideoSection";

/** Server-composed landing page; each section is a small client leaf. */
export default function Landing({ data }: { data: LandingPage | null }) {
	return (
		<>
			<section id='home' aria-label='المقدمة'>
				<Hero
					headerTitle={data?.headerTitle}
					headerSubtitle={data?.headerSubtitle}
					headerImage={data?.headerImage}
				/>
			</section>
			<FeaturesSection />
			{data?.landingVideoId ? (
				<VideoSection videoId={data.landingVideoId} />
			) : null}
			<AboutSection
				aboutTitle={data?.aboutTitle}
				aboutSubtitle={data?.aboutSubtitle}
				aboutImage={data?.aboutImage}
			/>
			<ContactUs
				whatsappNumber={data?.whatsAppNumber}
				address={data?.address}
				email={data?.email}
			/>
		</>
	);
}
