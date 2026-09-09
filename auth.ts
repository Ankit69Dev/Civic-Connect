import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  providers: [
    Google,

    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },

        loginType: {
          label: "Login Type",
          type: "text",
        },
      },

      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        const loginType = credentials?.loginType as string | undefined;

        if (!email || !password || !loginType) {
          return null;
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user in Neon
        const users = await sql`
          SELECT
            id,
            name,
            email,
            password_hash,
            role,
            provider
          FROM users
          WHERE email = ${normalizedEmail}
          LIMIT 1
        `;

        if (users.length === 0) {
          return null;
        }

        const user = users[0];

        // Make sure this is a password-based account
        if (!user.password_hash) {
          return null;
        }

        // Check password
        const passwordValid = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordValid) {
          return null;
        }

        // -----------------------------------
        // ROLE-BASED LOGIN
        // -----------------------------------

        // Normal /login only allows citizens
        if (loginType === "citizen" && user.role !== "citizen") {
          return null;
        }

        // /admin/login only allows admins
        if (loginType === "admin" && user.role !== "admin") {
          return null;
        }

        // Invalid login type
        if (loginType !== "citizen" && loginType !== "admin") {
          return null;
        }

        console.log("AUTH LOGIN:", {
          email: user.email,
          role: user.role,
          loginType,
        });

        // Login successful
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role =
          (user as { role?: string }).role ?? "citizen";
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id =
          token.id as string;

        (session.user as { role?: string }).role =
          token.role as string;
      }

      return session;
    },
  },
});