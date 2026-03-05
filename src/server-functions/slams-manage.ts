import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

const UpdateSlamSchema = object({
  slamId: pipe(string(), nonEmpty()),
  name: pipe(string(), nonEmpty('Slam name is required')),
  description: pipe(string(), nonEmpty('Description is required')),
})

export const updateSlamFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { slamId: string; name: string; description: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(UpdateSlamSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid form data',
      }
    }

    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const updated = await prisma.slam.updateMany({
      where: { id: result.output.slamId, creatorId: session.user.id },
      data: {
        name: result.output.name,
        description: result.output.description,
      },
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Slam not found or you are not the owner' }
    }

    return { status: 'success' as const }
  })

const DeleteSlamSchema = object({
  slamId: pipe(string(), nonEmpty()),
})

export const deleteSlamFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { slamId: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(DeleteSlamSchema, data)
    if (!result.success) {
      return {
        status: 'error' as const,
        message: result.issues[0]?.message || 'Invalid data',
      }
    }

    const session = await getSession()
    if (session == null) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const updated = await prisma.slam.updateMany({
      where: { id: result.output.slamId, creatorId: session.user.id },
      data: { isDeleted: true },
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Slam not found or you are not the owner' }
    }

    return { status: 'success' as const }
  })
