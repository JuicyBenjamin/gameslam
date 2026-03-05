import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { object, string, pipe, nonEmpty, minLength, maxLength, safeParse } from 'valibot'
import { supabase } from '@/lib/supabase.server'
import { users } from '@/db/schema/users'
import { db } from '@/server-functions/database'
import { eq } from 'drizzle-orm'

export const checkAuthForWelcomeFn = createServerFn().handler(async () => {
  const supabaseClient = supabase()
  const { data } = await supabaseClient.auth.getUser()

  if (!data.user) {
    throw redirect({ to: '/login' })
  }

  const existing = await db.select().from(users).where(eq(users.id, data.user.id)).limit(1)
  if (existing.length > 0) {
    throw redirect({ to: '/' })
  }

  return { authUserId: data.user.id }
})

const SetupProfileSchema = object({
  name: pipe(
    string(),
    nonEmpty('Display name is required'),
    minLength(2, 'Display name must be at least 2 characters'),
    maxLength(30, 'Display name must be 30 characters or less'),
  ),
  avatarLink: pipe(string(), nonEmpty('Avatar is required')),
})

export const setupProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; avatarLink: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(SetupProfileSchema, data)
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
        message: 'You must be logged in',
      }
    }

    const existing = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

    if (existing.length > 0) {
      return {
        status: 'error' as const,
        message: 'Profile already exists',
      }
    }

    const nameTaken = await db
      .select()
      .from(users)
      .where(eq(users.name, result.output.name))
      .limit(1)

    if (nameTaken.length > 0) {
      return {
        status: 'error' as const,
        message: 'That display name is already taken',
      }
    }

    await db.insert(users).values({
      id: user.id,
      name: result.output.name,
      avatarLink: result.output.avatarLink,
    })

    return { status: 'success' as const }
  })

const UpdateProfileSchema = object({
  name: pipe(
    string(),
    nonEmpty('Display name is required'),
    minLength(2, 'Display name must be at least 2 characters'),
    maxLength(30, 'Display name must be 30 characters or less'),
  ),
  avatarLink: pipe(string(), nonEmpty('Avatar is required')),
})

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; avatarLink: string }) => data)
  .handler(async ({ data }) => {
    const result = safeParse(UpdateProfileSchema, data)
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
        message: 'You must be logged in',
      }
    }

    const nameTaken = await db
      .select()
      .from(users)
      .where(eq(users.name, result.output.name))
      .limit(1)

    if (nameTaken.length > 0 && nameTaken[0].id !== user.id) {
      return {
        status: 'error' as const,
        message: 'That display name is already taken',
      }
    }

    await db
      .update(users)
      .set({
        name: result.output.name,
        avatarLink: result.output.avatarLink,
      })
      .where(eq(users.id, user.id))

    return { status: 'success' as const }
  })
