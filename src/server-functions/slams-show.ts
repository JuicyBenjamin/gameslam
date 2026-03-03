import { createServerFn } from '@tanstack/react-start'
import { object, string, pipe, nonEmpty, url, custom, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { slamEntries } from '@/db/schema/slamEntries'
import { db } from '@/server-functions/database'

const JoinSlamSchema = object({
  itchIoLink: pipe(
    string(),
    nonEmpty('Itch.io link is required'),
    url('Must be a valid URL'),
    custom(input => {
      if (typeof input !== 'string') return false
      return input.includes('itch.io')
    }, 'Must be an itch.io URL'),
  ),
})

export const joinSlamFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { itchIoLink: string; slamId: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(JoinSlamSchema, { itchIoLink: data.itchIoLink })
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
        message: 'You must be logged in to join a slam',
      }
    }

    // TODO: Fetch real itch.io data
    const itchData = {
      assetName: 'Mock Asset',
      description: 'Mock Description',
    }

    await db.insert(slamEntries).values({
      slamId: data.slamId,
      userId: user.id,
      linkToEntry: result.output.itchIoLink,
      name: itchData.assetName,
      description: itchData.description || 'No description provided',
    })

    return {
      status: 'success' as const,
      message: 'Successfully joined the slam!',
    }
  })
