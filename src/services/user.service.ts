import axios from "axios";

export type RegisterUserInput = {
	name: string;
	email: string;
	password: string;
};

export async function registerUser(payload: RegisterUserInput) {
	return axios.post("/api/user/register", payload);
}
