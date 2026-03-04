import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, uuid, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { slams } from '@/db/schema/slams'
import { db } from '@/server-functions/database'
import { eq, and } from 'drizzle-orm'

const UpdateSlamSchema = object({
  slamId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(slams)
      .set({
        name: result.output.name,
        description: result.output.description,
      })
      .where(and(eq(slams.id, result.output.slamId), eq(slams.createdBy, user.id)))
      .returning({ id: slams.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Slam not found or you are not the owner' }
    }

    return { status: 'success' as const }
  })

const DeleteSlamSchema = object({
  slamId: pipe(string(), nonEmpty(), uuid()),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return { status: 'error' as const, message: 'You must be logged in' }
    }

    const [updated] = await db
      .update(slams)
      .set({ isDeleted: true })
      .where(and(eq(slams.id, result.output.slamId), eq(slams.createdBy, user.id)))
      .returning({ id: slams.id })

    if (!updated) {
      return { status: 'error' as const, message: 'Slam not found or you are not the owner' }
    }

    return { status: 'success' as const }
  })
