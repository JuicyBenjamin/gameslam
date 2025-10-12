import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { object, string, pipe, nonEmpty, url, custom, safeParse } from 'valibot'
import { supabase } from '~/lib/supabase.server'
import { slamEntries } from '~/db/schema/slamEntries'
import { db } from '~/server-functions/database'

// Validation schema for join slam form
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

// Server function for joining slam
export const joinSlamFn = createServerFn({ method: 'POST' }).handler(async () => {
  // Get the data from the request body
  const { itchIoLink, slamId } = await getRequest().json()

  // Validate the form data

  const result = safeParse(JoinSlamSchema, { itchIoLink })
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

  try {
    // Mock itch.io data for now
    const itchData = {
      assetName: 'Mock Asset',
      description: 'Mock Description',
    }

    // Create the entry
    await db.insert(slamEntries).values({
      slamId: slamId,
      userId: user.id,
      linkToEntry: result.output.itchIoLink,
      name: itchData.assetName,
      description: itchData.description || 'No description provided',
    })

    return {
      status: 'success' as const,
      message: 'Successfully joined the slam!',
    }
  } catch (error) {
    console.error('Error joining slam:', error)
    return {
      status: 'error' as const,
      message: 'Failed to join slam. Please try again.',
    }
  }
})
