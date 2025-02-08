import { db } from "../index";
import { artists } from "../schema/artists";
import { assets } from "../schema/assets";
import { slams } from "../schema/slams";
// import type { SelectUser } from "../schema/users";
import type { SelectSlam } from "../schema/slams";
import { eq } from "drizzle-orm";
import { users } from "../schema/users";

export async function getAllSlams() {
  return await db.select().from(slams);
}

export async function getSlamById(id: SelectSlam["id"]) {
  const [slam] = await db
    .select()
    .from(slams)
    .where(eq(slams.id, id))
    .leftJoin(artists, eq(slams.artistId, artists.id))
    .leftJoin(assets, eq(slams.assetId, assets.id))
    .leftJoin(users, eq(slams.createdBy, users.id));
  return slam;
}
