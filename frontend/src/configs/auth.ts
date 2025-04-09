import { AuthOptions, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "Email",
          required: true,
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return { id: credentials.email, email: credentials.email };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return {
        user: session.user.email,
      } as unknown as Session;
    },
  },
};
