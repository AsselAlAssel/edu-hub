import { activeUnitIds } from "@/libs/unitGrants";
import type { PublicUser, RoleName } from "@/libs/users";

/**
 * Units the student has open now that are still on sale. Grants on units
 * since deleted or made free, or already expired, stay in the DB but don't count.
 */
export const unitCount = (
	user: Pick<PublicUser, "unitGrants">,
	onSale: Pick<ReadonlySet<string>, "has">,
	now = Date.now()
) =>
	activeUnitIds(user.unitGrants ?? [], now).filter((id) => onSale.has(id))
		.length;

export const roleOf = (user: Pick<PublicUser, "role">): RoleName =>
	user.role === "ADMIN" ? "ADMIN" : "USER";
