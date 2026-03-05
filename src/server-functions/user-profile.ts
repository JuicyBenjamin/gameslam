import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchUserProfile = createServerFn({ method: 'GET' })
  .inputValidator((data: { userName: string }) => data)
  .handler(async ({ data }) => {
    const user = await prisma.user.findUnique({
      where: { name: data.userName },
      include: {
        createdSlams: true,
        slamEntries: true,
        _count: {
          select: {
            createdSlams: true,
            slamEntries: true,
          },
        },
      },
    })

    if (user == null) {
      throw new Error('User not found')
    }

    const { createdSlams, slamEntries, _count, ...userData } = user

    return {
      user: userData,
      slams: createdSlams,
      entries: slamEntries,
      stats: {
        totalSlams: _count.createdSlams,
        totalEntries: _count.slamEntries,
      },
    }
  })
