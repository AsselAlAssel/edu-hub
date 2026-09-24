import { prisma } from "@/libs/prismaDb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {
	type NextAuthOptions,
	DefaultSession,
	getServerSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User & DefaultSession["user"];
	}
}

const INVALID_CREDENTIALS = "البريد الإلكتروني أو كلمة المرور غير صحيحة";

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
				email: { label: "البريد الإلكتروني", type: "email" },
				password: { label: "كلمة المرور", type: "password" },
			},

			async authorize(credentials) {
				// check to see if email and password is there
				if (!credentials?.email || !credentials?.password) {
					throw new Error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
				}
				const email = credentials.email.trim().toLowerCase();

				// check to see if user already exists
				const user = await prisma.user.findUnique({
					where: { email },
				});

				// if user was not found
				if (!user || !user?.password) {
					throw new Error(INVALID_CREDENTIALS);
				}

				// check to see if passwords match
				const passwordMatch = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!passwordMatch) {
					throw new Error(INVALID_CREDENTIALS);
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
				};
			}

			if (user) {
				const sessionId = crypto.randomUUID();
				token.sessionId = sessionId;
				await prisma.session.create({
					data: {
						userId: user.id,
						expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
						sessionId,
					},
				});
				return {
					...token,
					uid: user.id,
					role: user.role,
					picture: user.image,
					image: user.image,
				};
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
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
