import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { artists } from "./schema";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const connectionString = process.env.DATABASE_URL;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(String(connectionString), { prepare: false });
const db = drizzle(client, { casing: "snake_case" });

const allArtists = await db.select().from(artists);

console.log(allArtists);
