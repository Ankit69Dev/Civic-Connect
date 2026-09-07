import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { sql, type DbUser } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google, // reads AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET automatically

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const rows = await sql`
          SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
        `;
        const user = rows[0] as DbUser | undefined;
        if (!user || !user.password_hash) return null;

        const valid = await bcrypt.compare(password, user.password_hash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  callbacks: {
    // Runs on every sign-in, including Google — upsert the user into Neon.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;

        const existing = await sql`
          SELECT id FROM users WHERE email = ${user.email.toLowerCase()} LIMIT 1
        `;

        if (existing.length === 0) {
          await sql`
            INSERT INTO users (name, email, image, provider)
            VALUES (${user.name ?? null}, ${user.email.toLowerCase()}, ${user.image ?? null}, 'google')
          `;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
});