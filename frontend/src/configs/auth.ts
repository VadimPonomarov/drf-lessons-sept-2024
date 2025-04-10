import { AuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const authConfig: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          required: true,
        },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        return { id: credentials.email, email: credentials.email };
      },
    }),
  ],
  session: {
    strategy: "jwt", // Next jwt strategy for token srorage
    maxAge: 60 * 60 * 24, // Max expire in 24 hour
  },
  callbacks: {
    async jwt({ token, user }) {
      // Сохраняем токен авторизации, если пользователь авторизуется
      if (user) {
        token.accessToken = user.id; // Используем ID как токен для демонстрации
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.expires) {
        throw new Error("Session expiration date is undefined.");
      }

      const expiresTimestamp = new Date(session.expires).getTime();

      if (isNaN(expiresTimestamp)) {
        throw new Error("Session expiration date is not a valid timestamp.");
      }

      return {
        email: session.user.email,
        accessToken: token.accessToken, // Добавляем токен в сессию
        expiresOn: new Date(expiresTimestamp).toLocaleString(), // Локализованная дата истечения
      } as unknown as Session;
    },
  },
};
