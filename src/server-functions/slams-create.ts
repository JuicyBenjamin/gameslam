import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, uuid, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { slams } from '@/db/schema/slams'
import { db } from '@/server-functions/database'

const CreateSlamSchema = object({
  name: pipe(string(), nonEmpty('Slam name is required')),
  description: pipe(string(), nonEmpty('Description is required')),
  artistId: pipe(string(), nonEmpty('Artist is required'), uuid('Invalid artist')),
  assetId: pipe(string(), nonEmpty('Asset is required'), uuid('Invalid asset')),
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

    const supabaseClient = supabase()
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user?.id) {
      return {
        status: 'error' as const,
        message: 'You must be logged in to create a slam',
      }
    }

    const [inserted] = await db
      .insert(slams)
      .values({
        name: result.output.name,
        description: result.output.description,
        artistId: result.output.artistId,
        assetId: result.output.assetId,
        createdBy: user.id,
      })
      .returning({ id: slams.id })

    return {
      status: 'success' as const,
      slamId: inserted.id,
    }
  })
