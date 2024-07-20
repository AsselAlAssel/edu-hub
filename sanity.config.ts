import schemas from "@/sanity/schemas";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

const config = defineConfig({
	projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
	dataset: "production",
	title: process.env.NEXT_PUBLIC_SANITY_PROJECT_TITLE as string,
	apiVersion: "2023-03-09",
	basePath: "/studio",
	plugins: [deskTool()],
	schema: { types: schemas },
});

export default config;
