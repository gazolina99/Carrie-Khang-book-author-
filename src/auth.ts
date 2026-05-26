import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Some platforms inject the public URL automatically.
if (!process.env.AUTH_URL && process.env.RAILWAY_PUBLIC_DOMAIN) {
  process.env.AUTH_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
}
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.RAILWAY_PUBLIC_DOMAIN) {
  process.env.NEXT_PUBLIC_SITE_URL = `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
}
if (!process.env.AUTH_URL && process.env.VERCEL_URL) {
  process.env.AUTH_URL = `https://${process.env.VERCEL_URL}`;
}
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.VERCEL_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = `https://${process.env.VERCEL_URL}`;
}
if (!process.env.AUTH_URL && process.env.URL) {
  process.env.AUTH_URL = process.env.URL;
}
if (!process.env.NEXT_PUBLIC_SITE_URL && process.env.URL) {
  process.env.NEXT_PUBLIC_SITE_URL = process.env.URL;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 14,
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password || typeof email !== "string") {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        });
        if (!user?.passwordHash) {
          return null;
        }
        const valid = await compare(String(password), user.passwordHash);
        if (!valid) {
          return null;
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
