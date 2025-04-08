import { AuthOptions, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { IDummyAuth } from "@/common/interfaces/dummy.interfaces.ts";
import { apiAuthService } from "@/services/apiAuth.ts";

export const authConfig: AuthOptions = {
    providers: [
        Credentials({
            credentials: {
                username: {
                    label: "Username",
                    type: "text",
                    required: true,
                },
                password: {
                    label: "Password",
                    type: "password",
                    required: true,
                },
                expiresInMins: {
                    label: "Expires in Minutes",
                    type: "number",
                    required: true,
                },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                try {
                    const response = await apiAuthService.login(credentials as unknown as IDummyAuth);
                    if (!response) {
                        throw new Error("Invalid login response");
                    }
                    return { ...response } as unknown as User;
                } catch (error) {
                    console.error("Error in authorize function: ", error);
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/api/auth",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return { ...token, ...user };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token;
            return session;
        },
    },
};

