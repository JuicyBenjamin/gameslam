import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, optional, nullable, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

const CreateCommentSchema = object({
  slamEntryId: pipe(string(), nonEmpty()),
  comment: pipe(string(), nonEmpty('Comment cannot be empty')),
  parentCommentId: optional(nullable(string())),
})

export const createEntryCommentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { slamEntryId: string; comment: string; parentCommentId?: string | null }) => data,
  )
  .handler(async ({ data }) => {
    const result = safeParse(CreateCommentSchema, data)
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

    await prisma.slamEntryComment.create({
      data: {
        authorId: session.user.id,
        slamEntryId: result.output.slamEntryId,
        comment: result.output.comment,
        parentCommentId: result.output.parentCommentId ?? null,
      },
    })

    return { status: 'success' as const }
  })

const UpdateCommentSchema = object({
  commentId: pipe(string(), nonEmpty()),
  comment: pipe(string(), nonEmpty('Comment cannot be empty')),
})

export const updateEntryCommentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { commentId: string; comment: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(UpdateCommentSchema, data)
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

    const updated = await prisma.slamEntryComment.updateMany({
      where: { id: result.output.commentId, authorId: session.user.id },
      data: { comment: result.output.comment },
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Comment not found or you are not the author' }
    }

    return { status: 'success' as const }
  })

const DeleteCommentSchema = object({
  commentId: pipe(string(), nonEmpty()),
})

export const deleteEntryCommentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { commentId: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(DeleteCommentSchema, data)
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

    const updated = await prisma.slamEntryComment.updateMany({
      where: { id: result.output.commentId, authorId: session.user.id },
      data: { isDeleted: true },
    })

    if (updated.count === 0) {
      return { status: 'error' as const, message: 'Comment not found or you are not the author' }
    }

    return { status: 'success' as const }
  })
