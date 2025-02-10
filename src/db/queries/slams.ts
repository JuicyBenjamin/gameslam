import { db } from "../index";
import { artists } from "../schema/artists";
import { assets } from "../schema/assets";
import { slams } from "../schema/slams";
// import type { SelectUser } from "../schema/users";
import type { SelectSlam } from "../schema/slams";
import { eq, getTableColumns } from "drizzle-orm";
import { users } from "../schema/users";
import { slamEntries } from "../schema/slamEntries";

export async function getAllSlams() {
  return await db.select().from(slams);
}

export async function getSlamById(id: SelectSlam["id"]) {
  const slamsResult = await db
    .select({
      slam: getTableColumns(slams),
      artist: getTableColumns(artists),
      asset: getTableColumns(assets),
      createdBy: getTableColumns(users),
      entries: getTableColumns(slamEntries),
    })
    .from(slams)
    .where(eq(slams.id, id))
    .leftJoin(artists, eq(slams.artistId, artists.id))
    .leftJoin(assets, eq(slams.assetId, assets.id))
    .leftJoin(users, eq(slams.createdBy, users.id))
    .leftJoin(slamEntries, eq(slamEntries.slamId, slams.id));

  const slam = {
    ...slamsResult[0],
    entries: slamsResult.map((row) => row.entries),
  };
  return slam;
}
