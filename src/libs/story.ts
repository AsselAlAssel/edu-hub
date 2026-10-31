import type { Story } from "@prisma/client";
import { prisma } from "./prismaDb";

export const getStories = () =>
	prisma.story.findMany({
		orderBy: [{ rank: "asc" }, { createdAt: "asc" }],
	});

export type { Story };
