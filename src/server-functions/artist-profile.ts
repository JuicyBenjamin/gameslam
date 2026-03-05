import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchArtistProfile = createServerFn({ method: 'GET' })
  .inputValidator((data: { artistName: string }) => data)
  .handler(async ({ data }) => {
    const artist = await prisma.artist.findUnique({
      where: { name: data.artistName },
      include: {
        artistAssets: {
          include: { asset: true },
        },
        slams: true,
      },
    })

    if (artist == null) {
      throw new Error('Artist not found')
    }

    const { artistAssets, slams, ...artistData } = artist

    return {
      artist: artistData,
      assets: artistAssets.map(aa => aa.asset),
      slams,
    }
  })
