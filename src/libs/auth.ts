import { prisma } from "@/libs/prismaDb";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type NextAuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { getServerSession } from "next-auth";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

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

			async authorize(credentials) {
				// check to see if eamil and password is there
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email or password");
				}

				// check to see if user already exist
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

		EmailProvider({
			server: {
				host: process.env.EMAIL_SERVER_HOST,
				port: Number(process.env.EMAIL_SERVER_PORT),
				auth: {
					user: process.env.EMAIL_SERVER_USER,
					pass: process.env.EMAIL_SERVER_PASSWORD,
				},
			},
			from: process.env.EMAIL_FROM,
		}),

		GitHubProvider({
			clientId: process.env.GITHUB_CLIENT_ID || "",
			clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		}),
	],

	callbacks: {
		jwt: async (payload: any) => {
			const { token, trigger, session } = payload;
			const user: User = payload.user;

			if (trigger === "update") {
				// console.log(token.picture, session.user);
				return {
					...token,
					...session.user,
					picture: session.user.image,
					image: session.user.image,
					stripePriceId: session.user.stripePriceId,
					stripeCurrentPeriodEnd: session.user.stripeCurrentPeriodEnd,
				};
			}

			if (user) {
				return {
					...token,
					uid: user.id,
					stripePriceId: user.stripePriceId,
					stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
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
						stripePriceId: token.stripePriceId,
						stripeCurrentPeriodEnd: token.stripeCurrentPeriodEnd,
						role: token.role,
						image: token.picture,
					},
				};
			}
			return session;
		},
	},

	// debug: process.env.NODE_ENV === "developement",
};

export const getAuthSession = async () => {
	return getServerSession(authOptions);
};
