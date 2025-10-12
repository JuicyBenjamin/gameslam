import { createServerFn } from '@tanstack/react-start'
import { artists } from '~/db/schema/artists'
import { assets } from '~/db/schema/assets'
import { artistAssets } from '~/db/schema/artistAssets'
import { slamEntries } from '~/db/schema/slamEntries'
import { users } from '~/db/schema/users'
import { slams } from '~/db/schema/slams'
import { db } from '~/server-functions/database'
import { count, eq, getTableColumns, sql } from 'drizzle-orm'

// Server function for fetching featured content (SSR)
export const fetchFeaturedContent = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching featured content on server...')

  try {
    // Get top 5 slams
    const allSlams = await db
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
      .orderBy(slams.createdAt)

    const topSlams = allSlams.slice(0, 5)

    // Get top 5 artists with their asset counts
    const topArtists = await db
      .select({
        artist: artists,
        assetCount: count(artistAssets.assetId),
      })
      .from(artists)
      .leftJoin(artistAssets, eq(artistAssets.artistId, artists.id))
      .groupBy(artists.id)
      .orderBy(count(artistAssets.assetId))
      .limit(5)

    // Get top 5 assets
    const topAssets = await db.select().from(assets).limit(5)

    // Get top 5 entries with user information
    const topEntries = await db
      .select({
        entry: slamEntries,
        user: users,
      })
      .from(slamEntries)
      .leftJoin(users, eq(slamEntries.userId, users.id))
      .limit(5)

    const result = {
      slams: topSlams,
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

    return result
  } catch (error) {
    console.error('Error fetching featured content:', error)
    throw error
  }
})
