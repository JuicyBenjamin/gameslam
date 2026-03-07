import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

const CreateSlamSchema = object({
  name: pipe(string(), nonEmpty('Slam name is required')),
  description: pipe(string(), nonEmpty('Description is required')),
  artistId: pipe(string(), nonEmpty('Artist is required')),
  assetId: pipe(string(), nonEmpty('Asset is required')),
})

export const createSlamFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { name: string; description: string; artistId: string; assetId: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = safeParse(CreateSlamSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const session = await getSession()
    if (session == null) {
      return {
        status: 'error' as const,
        message: 'You must be logged in to create a slam',
      }
    }

    const slam = await prisma.slam.create({
      data: {
        name: result.output.name,
        description: result.output.description,
        artistId: result.output.artistId,
        assetId: result.output.assetId,
        creatorId: session.user.id,
      },
    })

    return {
      status: 'success' as const,
      slamId: slam.id,
    }
  })
