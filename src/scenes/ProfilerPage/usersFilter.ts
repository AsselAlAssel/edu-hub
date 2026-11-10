import type { PublicUser, RoleName } from "@/libs/users";

/**
 * Units the student owns that are still on sale. Ids of units since deleted
 * or made free stay in the DB (harmless: they open nothing) but don't count.
 */
export const unitCount = (
	user: Pick<PublicUser, "unlockedUnitIds">,
	onSale: Pick<ReadonlySet<string>, "has">
) => (user.unlockedUnitIds ?? []).filter((id) => onSale.has(id)).length;

export const roleOf = (user: Pick<PublicUser, "role">): RoleName =>
	user.role === "ADMIN" ? "ADMIN" : "USER";
