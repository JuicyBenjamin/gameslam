import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchArtists = createServerFn({ method: 'GET' }).handler(async () => {
  const artistsData = await prisma.artist.findMany({
    include: {
      artistAssets: {
        include: { asset: true },
      },
    },
    orderBy: { name: 'asc' },
  })

  return artistsData.map(({ artistAssets, ...artist }) => ({
    artist,
    assetCount: artistAssets.length,
    assets: artistAssets.map(aa => aa.asset),
  }))
})
