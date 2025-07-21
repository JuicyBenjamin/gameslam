import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL ?? "";

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(String(connectionString), {
  prepare: false,
  connection: {
    timeout: 10000, // 10 seconds connection timeout
  },
  idle_timeout: 20, // 20 seconds idle timeout
  max: 10, // Maximum 10 connections in pool
});
export const db = drizzle(client, { casing: "snake_case" });
