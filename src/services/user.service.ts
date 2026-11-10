import type { RoleName, UserStats, UsersPage } from "@/libs/users";
import axios from "axios";

export const USERS_URL = "/api/user";
export const USER_STATS_URL = "/api/user/stats";

export async function fetchUsersPage(key: string): Promise<UsersPage> {
	const response = await axios.get(key);
	return response.data;
}

export async function fetchUserStats(key: string): Promise<UserStats> {
	const response = await axios.get(key);
	return response.data;
}

export async function changeUserRoleRequest(arg: {
	id: string;
	role: RoleName;
}) {
	const response = await axios.patch(USERS_URL, arg);
	return response.data;
}

export async function deleteUserRequest(arg: { id: string }) {
	await axios.delete(USERS_URL, { data: arg });
}
