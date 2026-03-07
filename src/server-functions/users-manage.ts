import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { object, string, pipe, nonEmpty, minLength, maxLength, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

export const checkAuthForWelcomeFn = createServerFn().handler(async () => {
  const session = await getSession()

  if (session == null) {
    throw redirect({ to: '/login' })
  }

  const hasName = session.user.name !== '' && session.user.name !== session.user.email
  if (hasName) {
    throw redirect({ to: '/' })
  }

  return { authUserId: session.user.id }
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

    const session = await getSession()

    if (session == null) {
      return {
        status: 'error' as const,
        message: 'You must be logged in',
      }
    }

    const nameTaken = await prisma.user.findUnique({
      where: { name: result.output.name },
    })

    if (nameTaken != null && nameTaken.id !== session.user.id) {
      return {
        status: 'error' as const,
        message: 'That display name is already taken',
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: result.output.name,
        image: result.output.avatarLink,
      },
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

    const session = await getSession()

    if (session == null) {
      return {
        status: 'error' as const,
        message: 'You must be logged in',
      }
    }

    const nameTaken = await prisma.user.findUnique({
      where: { name: result.output.name },
    })

    if (nameTaken != null && nameTaken.id !== session.user.id) {
      return {
        status: 'error' as const,
        message: 'That display name is already taken',
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: result.output.name,
        image: result.output.avatarLink,
      },
    })

    return { status: 'success' as const }
  })
