import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchFeaturedContent = createServerFn({ method: 'GET' }).handler(async () => {
  const [allSlams, topArtists, topAssets, topEntries] = await Promise.all([
    prisma.slam.findMany({
      include: {
        artist: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        _count: { select: { entries: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.artist.findMany({
      include: { _count: { select: { artistAssets: true } } },
      orderBy: { name: 'asc' },
      take: 5,
    }),
    prisma.asset.findMany({ take: 5 }),
    prisma.slamEntry.findMany({
      include: { user: { select: { id: true, name: true } } },
      take: 5,
    }),
  ])

  return {
    slams: allSlams.slice(0, 5).map(({ _count, artist, createdBy, ...slam }) => ({
      slam,
      artist,
      createdBy,
      entryCount: _count.entries,
    })),
    artists: topArtists.map(({ _count, ...artist }) => ({
      ...artist,
      assetCount: _count.artistAssets,
    })),
    assets: topAssets,
    entries: topEntries.map(({ user, ...entry }) => ({
      ...entry,
      userName: user?.name,
    })),
  }
})
