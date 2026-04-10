import UserEmptyState from "./UserEmptyState";
import UserListTable from "./UserListTable";
import UserTopbar from "./UserTopbar";
import { getUsers } from "@/actions/user";
import { User } from "@prisma/client";

export const revalidate = 0;

export default async function UsersListContainer({ filter, search }: any) {
	let users: User[] = await getUsers(filter);

	if (search) {
		users = users?.filter((user) =>
			user?.email?.toLowerCase().includes(search?.toLowerCase())
		);
	}

	return (
		<>
			<div className='mb-5'>
				<UserTopbar />
			</div>
			{users?.length ? <UserListTable users={users} /> : <UserEmptyState />}
		</>
	);
}
