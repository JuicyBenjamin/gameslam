import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlamEntries = createServerFn({ method: 'GET' }).handler(async () => {
  const entries = await prisma.slamEntry.findMany({
    include: {
      user: { select: { id: true, name: true } },
      slam: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return entries.map(({ user, slam, ...entry }) => ({
    entry,
    user,
    slam,
  }))
})
