import { eq } from "drizzle-orm";
import { db } from "..";
import type { SelectUser } from "../schema/users";
import { users } from "../schema/users";

export async function getUserById(id: SelectUser["id"]) {
  const usersData = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return usersData.length > 0 ? usersData[0] : null;
}

export async function getUserByName(name: string) {
  const usersData = await db
    .select()
    .from(users)
    .where(eq(users.name, name))
    .limit(1);
  return usersData.length > 0 ? usersData[0] : null;
}
