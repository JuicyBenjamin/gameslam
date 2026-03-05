import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlamDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { slamId: string }) => data)
  .handler(async ({ data }) => {
    const slam = await prisma.slam.findUnique({
      where: { id: data.slamId },
      include: {
        artist: true,
        asset: true,
        creator: true,
        entries: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    })

    return slam
  })
