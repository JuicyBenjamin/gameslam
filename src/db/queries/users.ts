import { eq } from "drizzle-orm";
import { db, logQuery } from "../logger";
import type { SelectUser } from "../schema/users";
import { users } from "../schema/users";

export async function getUserById(id: SelectUser["id"]) {
  return await logQuery("getUserById", async () => {
    const usersData = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return usersData.length > 0 ? usersData[0] : null;
  });
}

export async function getUserByName(name: string) {
  return await logQuery("getUserByName", async () => {
    const usersData = await db
      .select()
      .from(users)
      .where(eq(users.name, name))
      .limit(1);
    return usersData.length > 0 ? usersData[0] : null;
  });
}