import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlamComments = createServerFn({ method: 'GET' }).handler(async () => {
  const comments = await prisma.slamComment.findMany({
    where: { isDeleted: false },
    include: {
      author: { select: { id: true, name: true } },
      slamEntry: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return comments.map(({ author, slamEntry, ...comment }) => ({
    comment,
    author,
    slamEntry,
  }))
})
