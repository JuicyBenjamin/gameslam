import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, boolean, optional, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

const CreateRatingSchema = object({
  slamEntryId: pipe(string(), nonEmpty()),
  isRecommended: boolean(),
  content: pipe(string(), nonEmpty('Review content is required')),
})

export const createEntryRatingFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { slamEntryId: string; isRecommended: boolean; content: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = safeParse(CreateRatingSchema, data)
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

    const existing = await prisma.slamEntryRating.findUnique({
      where: {
        authorId_slamEntryId: {
          authorId: session.user.id,
          slamEntryId: result.output.slamEntryId,
        },
      },
    })

    if (existing != null) {
      return { status: 'error' as const, message: 'You have already rated this entry' }
    }

    await prisma.slamEntryRating.create({
      data: {
        authorId: session.user.id,
        slamEntryId: result.output.slamEntryId,
        isRecommended: result.output.isRecommended,
        content: result.output.content,
      },
    })

    return { status: 'success' as const }
  })

const UpdateRatingSchema = object({
  ratingId: pipe(string(), nonEmpty()),
  isRecommended: optional(boolean()),
  content: optional(pipe(string(), nonEmpty('Review content is required'))),
})

export const updateEntryRatingFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { ratingId: string; isRecommended?: boolean; content?: string }) => data,
  )
  .handler(async ({ data }) => {
    const result = safeParse(UpdateRatingSchema, data)
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

    const updateData: { isRecommended?: boolean; content?: string } = {}
    if (result.output.isRecommended != null) updateData.isRecommended = result.output.isRecommended
    if (result.output.content != null) updateData.content = result.output.content

    const updated = await prisma.slamEntryRating.updateMany({
      where: { id: result.output.ratingId, authorId: session.user.id },
      data: updateData,
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Rating not found or you are not the author' }
    }

    return { status: 'success' as const }
  })

const DeleteRatingSchema = object({
  ratingId: pipe(string(), nonEmpty()),
})

export const deleteEntryRatingFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { ratingId: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(DeleteRatingSchema, data)
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

    const updated = await prisma.slamEntryRating.updateMany({
      where: { id: result.output.ratingId, authorId: session.user.id },
      data: { isDeleted: true },
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Rating not found or you are not the author' }
    }

    return { status: 'success' as const }
  })
