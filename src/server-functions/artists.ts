import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { artists } from '~/db/schema/artists'
import { artistAssets } from '~/db/schema/artistAssets'
import { assets } from '~/db/schema/assets'
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

    // Get all artist-asset relationships with full asset data
    const artistAssetsData = await db
      .select({
        artistId: artistAssets.artistId,
        asset: assets,
      })
      .from(artistAssets)
      .leftJoin(assets, eq(artistAssets.assetId, assets.id))

    // Group assets by artist
    const assetsByArtist = new Map<string, typeof assets.$inferSelect[]>()
    for (const row of artistAssetsData) {
      if (row.asset && row.artistId) {
        if (!assetsByArtist.has(row.artistId)) {
          assetsByArtist.set(row.artistId, [])
        }
        assetsByArtist.get(row.artistId)!.push(row.asset)
      }
    }

    // Combine artists with their assets
    const result = artistsData.map(({ artist, assetCount }) => ({
      artist,
      assetCount: Number(assetCount),
      assets: assetsByArtist.get(artist.id) || [],
    }))

    return result
  } catch (error) {
    console.error('Error fetching artists:', error)
    throw error
  }
})
