import { drizzle } from "drizzle-orm/vercel-postgres";
import { createClient } from "@vercel/postgres";

// Manually provide Supabase connection string
const client = createClient({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(client, { casing: "snake_case" });
