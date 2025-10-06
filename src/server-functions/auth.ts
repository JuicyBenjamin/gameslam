import { createServerFn } from '@tanstack/react-start'

export const getCurrentUser = createServerFn().handler(async () => {
  // Import server-side dependencies only inside the server function
  const { getSupabaseServerClient } = await import('~/server-functions/supabase')
  const { db } = await import('~/server-functions/database')
  const { users } = await import('~/db/server-only')
  const { eq } = await import('drizzle-orm')

  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return null
  }

  // Fetch the full user data from the database
  const userData = await db.select().from(users).where(eq(users.id, data.user.id)).limit(1)
  const user = userData.length > 0 ? userData[0] : null

  if (!user) {
    // User exists in Supabase but not in database - incomplete profile
    return { incompleteProfile: true }
  }

  return user
})

export const redirectIfLoggedIn = createServerFn().handler(async () => {
  // Import server-side dependencies only inside the server function
  const { getSupabaseServerClient } = await import('~/server-functions/supabase')

  const supabase = await getSupabaseServerClient()
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    // TODO: Use TanStack Router redirect
    throw new Error('Redirect to /')
  }
})
