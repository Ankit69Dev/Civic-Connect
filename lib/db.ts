import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

export const sql = databaseUrl ? neon(databaseUrl) : null;

export type DbUser = {
  id: string;
  name: string | null;
  email: string;
  password_hash: string | null;
  image: string | null;
  provider: string;
  created_at: string;
};