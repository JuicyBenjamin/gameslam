import { db, logQuery } from "../logger";
import { artists } from "../schema/artists";
import { assets } from "../schema/assets";
import { slams } from "../schema/slams";
// import type { SelectUser } from "../schema/users";
import type { SelectSlam } from "../schema/slams";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { users } from "../schema/users";
import { slamEntries } from "../schema/slamEntries";

export async function getAllSlams() {
  return await logQuery("getAllSlams", async () => {
    return await db
      .select({
        slam: getTableColumns(slams),
        artist: {
          id: artists.id,
          name: artists.name,
        },
        creator: {
          id: users.id,
          name: users.name,
        },
        entryCount: sql<number>`(
          SELECT COUNT(*)::int
          FROM ${slamEntries}
          WHERE ${slamEntries.slamId} = ${slams.id}
        )`,
      })
      .from(slams)
      .leftJoin(artists, eq(slams.artistId, artists.id))
      .leftJoin(users, eq(slams.createdBy, users.id))
      .orderBy(slams.createdAt);
  });
}

export async function getSlamById(id: SelectSlam["id"]) {
  return await logQuery("getSlamById", async () => {
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
  });
}