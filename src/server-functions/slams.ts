import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlams = createServerFn({ method: 'GET' }).handler(async () => {
  const slamsData = await prisma.slam.findMany({
    include: {
      artist: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { entries: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return slamsData.map(({ _count, artist, createdBy, ...slam }) => ({
    slam,
    artist,
    createdBy,
    entryCount: _count.entries,
  }))
})
