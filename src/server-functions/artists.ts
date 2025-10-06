import { createServerFn } from '@tanstack/react-start'

export const fetchArtists = createServerFn({ method: 'GET' }).handler(async () => {
  console.log('Fetching artists on server...')

  try {
    // Import server-side dependencies only inside the server function
    const { db } = await import('~/server-functions/database')
    const { artists, artistAssets, slams } = await import('~/db/server-only')
    const { count, eq } = await import('drizzle-orm')

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
