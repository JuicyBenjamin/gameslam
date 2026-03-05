import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, uuid, optional, nullable, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { slamEntryComments } from '@/db/schema/slamEntryComments'
import { db } from '@/server-functions/database'
import { eq, and } from 'drizzle-orm'

const CreateCommentSchema = object({
  slamEntryId: pipe(string(), nonEmpty(), uuid()),
  comment: pipe(string(), nonEmpty('Comment cannot be empty')),
  parentCommentId: optional(nullable(pipe(string(), uuid()))),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    await db.insert(slamEntryComments).values({
      authorId: user.id,
      slamEntryId: result.output.slamEntryId,
      comment: result.output.comment,
      parentCommentId: result.output.parentCommentId ?? null,
    })

    return { status: 'success' as const }
  })

const UpdateCommentSchema = object({
  commentId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(slamEntryComments)
      .set({ comment: result.output.comment })
      .where(
        and(
          eq(slamEntryComments.id, result.output.commentId),
          eq(slamEntryComments.authorId, user.id),
        ),
      )
      .returning({ id: slamEntryComments.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Comment not found or you are not the author' }
    }

    return { status: 'success' as const }
  })

const DeleteCommentSchema = object({
  commentId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(slamEntryComments)
      .set({ isDeleted: true })
      .where(
        and(
          eq(slamEntryComments.id, result.output.commentId),
          eq(slamEntryComments.authorId, user.id),
        ),
      )
      .returning({ id: slamEntryComments.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Comment not found or you are not the author' }
    }

    return { status: 'success' as const }
  })
