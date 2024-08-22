"use server";
import { prisma } from "@/libs/prismaDb";
export const getLandingData = () => {
	const landing = prisma.landingPage.findFirst();
	return landing;
};
