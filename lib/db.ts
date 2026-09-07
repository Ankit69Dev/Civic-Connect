import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export type DbUser = {
  id: string;
  name: string | null;
  email: string;
  password_hash: string | null;
  image: string | null;
  provider: string;
  created_at: string;
};