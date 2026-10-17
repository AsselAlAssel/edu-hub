/* eslint-disable no-console -- CLI migration script: console output is its UI. */
// Sets `hidden: false` on classes created before the field existed (Mongo has
// no column defaults). Only touches documents missing the field; safe to rerun.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

prisma
	.$runCommandRaw({
		update: "Class",
		updates: [
			{
				q: { hidden: { $exists: false } },
				u: { $set: { hidden: false } },
				multi: true,
			},
		],
	})
	.then((result) => console.log("Backfill done:", result))
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
