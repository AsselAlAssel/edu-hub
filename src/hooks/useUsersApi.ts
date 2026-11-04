import type { RoleName, UsersPage } from "@/libs/users";
import {
	USERS_PAGE_SIZE,
	usersQueryString,
	type UserFilters,
} from "@/libs/userQuery";
import {
	changeUserRoleRequest,
	deleteUserRequest,
	fetchUserStats,
	fetchUsersPage,
	USER_STATS_URL,
	USERS_URL,
} from "@/services/user.service";
import useSWR, { useSWRConfig } from "swr";
import useDebounced from "./useDebounced";

const SEARCH_DELAY_MS = 350;

const isUsersKey = (key: unknown) =>
	typeof key === "string" &&
	(key === USER_STATS_URL || key.startsWith(`${USERS_URL}?`));

/**
 * One page of users from the server, plus role changes and deletion (which
 * refetch every users page and the stats). Typing in the search waits for a
 * pause; the previous page stays on screen while the next one loads.
 */
export const useUsers = (filters: UserFilters, page: number) => {
	const { mutate: mutateAll } = useSWRConfig();
	const query = useDebounced(filters.query.trim(), SEARCH_DELAY_MS);
	const key = `${USERS_URL}?${usersQueryString({
		...filters,
		query,
		page,
		pageSize: USERS_PAGE_SIZE,
	})}`;
	const { data, error, isLoading, mutate } = useSWR(key, fetchUsersPage, {
		keepPreviousData: true,
	});
	const refresh = () => mutateAll(isUsersKey);

	const changeRole = async (id: string, role: RoleName) => {
		await mutate(
			changeUserRoleRequest({ id, role }).then(
				() => undefined as unknown as UsersPage
			),
			{
				// Only called from a rendered page, so `current` is there.
				optimisticData: (current) => ({
					...(current as UsersPage),
					users: (current?.users ?? []).map((user) =>
						user.id === id ? { ...user, role } : user
					),
				}),
				rollbackOnError: true,
				populateCache: false,
				revalidate: false,
			}
		);
		await refresh();
	};

	const deleteUser = async (id: string) => {
		await deleteUserRequest({ id });
		await refresh();
	};

	return {
		data,
		error,
		isLoading,
		// Typing that still waits for the pause counts as loading too.
		isFetching: isLoading || query !== filters.query.trim(),
		changeRole,
		deleteUser,
		refresh,
	};
};

export const useUserStats = () => {
	const { data, error } = useSWR(USER_STATS_URL, fetchUserStats);
	return { data, error };
};
