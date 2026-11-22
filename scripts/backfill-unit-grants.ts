/* eslint-disable no-console -- CLI migration script: console output is its UI. */
// Moves students from the old `unlockedUnitIds` list to `unitGrants`: every
// unit they had stays open until 31/08/2027 23:59 Palestine time (the cutoff
// in src/libs/access.ts). Run it BEFORE deploying the
// unit-expiry code. Leaves `unlockedUnitIds` in place, so the old deployment
// keeps working meanwhile; only touches users without grants, so safe to rerun.
import { PrismaClient } from "@prisma/client";
import { unitAccessEndInYear } from "../src/libs/access";

const prisma = new PrismaClient();
const expiresAt = unitAccessEndInYear(2027).toISOString();
console.log("Current subscribers keep their units until", expiresAt);

prisma
	.$runCommandRaw({
		update: "User",
		updates: [
			{
				q: {
					"unlockedUnitIds.0": { $exists: true },
					unitGrants: { $exists: false },
				},
				u: [
					{
						$set: {
							unitGrants: {
								$map: {
									input: "$unlockedUnitIds",
									as: "unitId",
									in: {
										unitId: "$$unitId",
										expiresAt: { $toDate: expiresAt },
									},
								},
							},
						},
					},
				],
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
