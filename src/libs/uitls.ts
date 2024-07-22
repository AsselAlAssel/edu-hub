import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export function absoluteUrl(path: string) {
	return `${process.env.SITE_URL || "http://localhost:3000"}${path}`;
}


export const getIsAuthorized = async () => {
	const session = await getServerSession(authOptions);
	return session?.user;
};
export const isAdmin = async () => {
	const session = await getServerSession(authOptions);
	return session?.user?.role === "ADMIN";
}

export const isUser = async () => {
	const session = await getServerSession(authOptions);
	return session?.user?.role === "USER" || session?.user?.role === "ADMIN";
}

