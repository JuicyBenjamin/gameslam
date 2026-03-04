import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, uuid, boolean, optional, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { slamEntryRatings } from '@/db/schema/slamEntryRatings'
import { db } from '@/server-functions/database'
import { eq, and } from 'drizzle-orm'

const CreateRatingSchema = object({
  slamEntryId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const existing = await db
      .select()
      .from(slamEntryRatings)
      .where(
        and(
          eq(slamEntryRatings.authorId, user.id),
          eq(slamEntryRatings.slamEntryId, result.output.slamEntryId),
        ),
      )
      .limit(1)

    if (existing.length > 0) {
      return { status: 'error' as const, message: 'You have already rated this entry' }
    }

    await db.insert(slamEntryRatings).values({
      authorId: user.id,
      slamEntryId: result.output.slamEntryId,
      isRecommended: result.output.isRecommended,
      content: result.output.content,
    })

    return { status: 'success' as const }
  })

const UpdateRatingSchema = object({
  ratingId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const updateData: Partial<{ isRecommended: boolean; content: string }> = {}
    if (result.output.isRecommended != null) updateData.isRecommended = result.output.isRecommended
    if (result.output.content != null) updateData.content = result.output.content

    const [updated] = await db
      .update(slamEntryRatings)
      .set(updateData)
      .where(
        and(
          eq(slamEntryRatings.id, result.output.ratingId),
          eq(slamEntryRatings.authorId, user.id),
        ),
      )
      .returning({ id: slamEntryRatings.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Rating not found or you are not the author' }
    }

    return { status: 'success' as const }
  })

const DeleteRatingSchema = object({
  ratingId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(slamEntryRatings)
      .set({ isDeleted: true })
      .where(
        and(
          eq(slamEntryRatings.id, result.output.ratingId),
          eq(slamEntryRatings.authorId, user.id),
        ),
      )
      .returning({ id: slamEntryRatings.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Rating not found or you are not the author' }
    }

    return { status: 'success' as const }
  })
