import { prisma } from "@/libs/prismaDb";

/**
 * Landing CMS document. Plain server helper (was a "use server" action,
 * which needlessly exposed it as a public POST endpoint).
 */
export const getLandingData = () => prisma.landingPage.findFirst();
