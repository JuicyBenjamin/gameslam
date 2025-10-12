import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { artists } from '~/db/schema/artists'
import { artistAssets } from '~/db/schema/artistAssets'
import { slams } from '~/db/schema/slams'
import { count, eq } from 'drizzle-orm'

export const fetchArtists = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching artists on server...')

  try {
    // Get all artists with their asset counts
    const artistsData = await db
      .select({
        artist: artists,
        assetCount: count(artistAssets.assetId),
      })
      .from(artists)
      .leftJoin(artistAssets, eq(artistAssets.artistId, artists.id))
      .groupBy(artists.id)
      .orderBy(artists.name)

    return artistsData
  } catch (error) {
    console.error('Error fetching artists:', error)
    throw error
  }
})
