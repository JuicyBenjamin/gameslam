import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlamEntryRatings = createServerFn({ method: 'GET' }).handler(async () => {
  const ratings = await prisma.slamEntryRating.findMany({
    where: { isDeleted: false },
    include: {
      author: { select: { id: true, name: true } },
      slamEntry: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return ratings.map(({ author, slamEntry, ...rating }) => ({
    rating,
    author,
    slamEntry,
  }))
})
