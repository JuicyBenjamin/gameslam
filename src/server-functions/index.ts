import { createServerFn } from '@tanstack/react-start'
import { artists } from '@/db/schema/artists'
import { assets } from '@/db/schema/assets'
import { artistAssets } from '@/db/schema/artistAssets'
import { slamEntries } from '@/db/schema/slamEntries'
import { users } from '@/db/schema/users'
import { slams } from '@/db/schema/slams'
import { db } from '@/server-functions/database'
import { count, eq, getTableColumns, sql } from 'drizzle-orm'

// Server function for fetching featured content (SSR)
export const fetchFeaturedContent = createServerFn({ method: 'GET' }).handler(async () => {
  const [allSlams, topArtists, topAssets, topEntries] = await Promise.all([
    db
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
      .orderBy(slams.createdAt),
    db
      .select({
        artist: artists,
        assetCount: count(artistAssets.assetId),
      })
      .from(artists)
      .leftJoin(artistAssets, eq(artistAssets.artistId, artists.id))
      .groupBy(artists.id)
      .orderBy(count(artistAssets.assetId))
      .limit(5),
    db.select().from(assets).limit(5),
    db
      .select({
        entry: slamEntries,
        user: users,
      })
      .from(slamEntries)
      .leftJoin(users, eq(slamEntries.userId, users.id))
      .limit(5),
  ])

  return {
    slams: allSlams.slice(0, 5),
    artists: topArtists.map(a => ({
      ...a.artist,
      assetCount: Number(a.assetCount),
    })),
    assets: topAssets,
    entries: topEntries.map(e => ({
      ...e.entry,
      userName: e.user?.name,
    })),
  }
})
