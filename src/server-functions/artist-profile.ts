import { createServerFn } from '@tanstack/react-start'
import { db } from '~/server-functions/database'
import { artists } from '~/db/schema/artists'
import { assets } from '~/db/schema/assets'
import { artistAssets } from '~/db/schema/artistAssets'
import { slams } from '~/db/schema/slams'
import { eq } from 'drizzle-orm'
import { parse } from 'node-html-parser'

// Server function for fetching artist profile
export const fetchArtistProfile = createServerFn({ method: 'GET' })
  .inputValidator((data: { artistName: string }) => data)
  .handler(async ({ data }) => {
  const { artistName } = data

  try {
    // Get artist by name
    const artistData = await db.select().from(artists).where(eq(artists.name, artistName)).limit(1)

    if (artistData.length === 0) {
      throw new Error('Artist not found')
    }

    const artist = artistData[0]

    // Get artist's assets
    const artistAssetsData = await db
      .select({
        asset: assets,
        artistAsset: artistAssets,
      })
      .from(artistAssets)
      .leftJoin(assets, eq(artistAssets.assetId, assets.id))
      .where(eq(artistAssets.artistId, artist.id))

    // Get artist's slams
    const artistSlams = await db.select().from(slams).where(eq(slams.artistId, artist.id))

    // Parse HTML description if it exists
    let parsedDescription = ''
    if (artist.link) {
      try {
        const parsed = parse(artist.link)
        parsedDescription = parsed.textContent || artist.link
      } catch (error) {
        console.warn('Failed to parse HTML description:', error)
      }
    }

    const result = {
      artist,
      assets: artistAssetsData.map(aa => aa.asset),
      slams: artistSlams,
      description: parsedDescription,
    }

    return result
  } catch (error) {
    console.error('Error fetching artist profile:', error)
    throw error
  }
})
