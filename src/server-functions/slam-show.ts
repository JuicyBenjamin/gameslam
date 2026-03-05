import { createServerFn } from '@tanstack/react-start'
import { prisma } from '@/lib/prisma.server'

export const fetchSlamDetails = createServerFn({ method: 'GET' })
  .inputValidator((data: { slamId: string }) => data)
  .handler(async ({ data }) => {
    const result = await prisma.slam.findUnique({
      where: { id: data.slamId },
      include: {
        artist: true,
        asset: true,
        createdBy: true,
        entries: {
          include: {
            user: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (result == null) return null

    const { artist, asset, createdBy, entries, ...slam } = result

    return { slam, artist, asset, createdBy, entries }
  })
