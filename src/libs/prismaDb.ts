import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Query logging is opt-in (PRISMA_LOG_QUERIES=1); it floods production logs.
export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: process.env.PRISMA_LOG_QUERIES === "1" ? ["query"] : ["error"],
	});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
