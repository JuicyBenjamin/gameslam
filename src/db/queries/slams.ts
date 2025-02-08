import { db } from "../index";
import { slams } from "../schema/slams";
// import type { SelectUser } from "../schema/users";
import type { SelectSlam } from "../schema/slams";
import { eq } from "drizzle-orm";

export async function getAllSlams() {
  return await db.select().from(slams);
}

export async function getSlamById(id: SelectSlam["id"]) {
  return await db.select().from(slams).where(eq(slams.id, id));
}
