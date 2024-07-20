import CallToAction from "./CallToAction";
import Counter from "./Counter";
import FAQ from "./FAQ";
import Features from "./Features";
import FeaturesWithImage from "./FeaturesWithImage";
import Hero from "./Hero";
import Newsletter from "./Newsletter";
import Pricing from "./Pricing";
import Testimonials from "./Testimonials";
const Home = () => {
	return (
		<>
			<Hero />
			<Features />
			<FeaturesWithImage />
			<Counter />
			<CallToAction />
			<Testimonials />
			<Pricing />
			<FAQ />
			<Newsletter />
		</>
	);
};

export default Home;
