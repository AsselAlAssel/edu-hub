const config = {
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
	dataset: "production",
	apiVersion: "2023-03-09",
	useCdn: false,
	token: process.env.SANITY_API_KEY as string,
};

export default config;
