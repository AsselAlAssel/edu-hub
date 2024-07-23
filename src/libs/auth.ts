import { prisma } from "@/libs/prismaDb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";
import { signOut } from "next-auth/react";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"];
	}
}

export const authOptions: NextAuthOptions = {
	pages: {
		signIn: "/auth/signin",
	},
	adapter: PrismaAdapter(prisma),
	secret: process.env.SECRET,
	session: {
		strategy: "jwt",
	},

	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "Jhondoe" },
				password: { label: "Password", type: "password" },
				username: { label: "Username", type: "text", placeholder: "Jhon Doe" },
			},

			async authorize(credentials, req) {
				// check to see if email and password is there
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email or password");
				}

				// check to see if user already exists
				const user = await prisma.user.findUnique({
					where: {
						email: credentials.email,
					},
				});

				// if user was not found
				if (!user || !user?.password) {
					throw new Error("No user found");
				}

				// check to see if passwords match
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					throw new Error("Incorrect password");
				}

				return user;
			},
		}),
	],

	callbacks: {
		jwt: async (payload: any) => {
			const { token, trigger, session } = payload;
			const user: User = payload.user;

			if (trigger === "update") {
				return {
					...token,
					...session.user,
					picture: session.user.image,
					image: session.user.image,
					test: "1",
				};
			}

			if (user) {
				const sessionId = uuid();
				token.sessionId = sessionId;
				await prisma.session.create({
					data: {
						userId: user.id,
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
						sessionId,
					},
				});
				token.sessionId = sessionId;
				console.log("sessionId1111:", sessionId);
				return {
					...token,
					uid: user.id,
					role: user.role,
					picture: user.image,
					image: user.image,
				};
			}
			const tempSession = await prisma.session.findUnique({
				where: {
					sessionId: token.sessionId,
				},
			});
			if (!tempSession) {
				signOut({ callbackUrl: "/auth/signin" });
			}

			return token;
		},

		session: async ({ session, token }) => {
			if (session?.user) {
				return {
					...session,
					user: {
						...session.user,
						id: token.sub,
						role: token.role,
						image: token.picture,
						sessionId: token.sessionId,
					},
				};
			}
			return session;
		},

		signIn: async ({ user }) => {
			await prisma.session.deleteMany({
				where: {
					userId: user.id,
				},
			});
			return true;
		},
	},

	// debug: process.env.NODE_ENV === "developement",
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
