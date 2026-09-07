import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
<<<<<<< HEAD
import bcrypt from "bcryptjs";
// import { sql, type DbUser } from "@/lib/db";
=======
>>>>>>> 61e8f01b8008084c293f9ab9212a8bf946675cc2

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google, // still needs AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET to work

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

<<<<<<< HEAD
        // const rows = await sql`
        //   SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1
        // `;
        // const user = rows[0] as DbUser | undefined;
        if (!user || !user.password_hash) return null;
=======
        // ── TEMPORARY: hardcoded demo accounts, no database yet ──
        // Swap this block for a real Neon/Prisma lookup once your DB is set up.
        const demoUsers = [
          {
            id: "demo-admin",
            name: "Admin",
            email: process.env.DEMO_ADMIN_EMAIL,
            password: process.env.DEMO_ADMIN_PASSWORD,
            role: "admin",
          },
          {
            id: "demo-citizen",
            name: "Demo Citizen",
            email: process.env.DEMO_CITIZEN_EMAIL,
            password: process.env.DEMO_CITIZEN_PASSWORD,
            role: "citizen",
          },
        ];
>>>>>>> 61e8f01b8008084c293f9ab9212a8bf946675cc2

        const match = demoUsers.find(
          (u) => u.email && u.email.toLowerCase() === email.toLowerCase()
        );

        if (!match || match.password !== password) return null;

        return {
          id: match.id,
          name: match.name,
          email: match.email,
          role: match.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role ?? "citizen";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = token.role as string;
      }
      return session;
    },
  },
});