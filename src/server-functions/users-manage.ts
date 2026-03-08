import { createServerFn } from '@tanstack/react-start'
import { redirect } from '@tanstack/react-router'
import { object, string, pipe, nonEmpty, minLength, maxLength, safeParse } from 'valibot'
import { getSession } from '@/server-functions/auth.server'
import { prisma } from '@/lib/prisma.server'

export const guardWelcomeFn = createServerFn().handler(async () => {
  const session = await getSession()

  if (session == null) {
    throw redirect({ to: '/login' })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user == null) {
    throw redirect({ to: '/login' })
  }

  const hasCustomName = user.itchUsername != null && user.name !== user.itchUsername
  if (hasCustomName) {
    throw redirect({ to: '/' })
  }
})

export const fetchWelcomeDataFn = createServerFn().handler(async () => {
  const session = await getSession()

  if (session == null) {
    throw redirect({ to: '/login' })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (user == null) {
    throw redirect({ to: '/login' })
  }

  return {
    authUserId: user.id,
    itchUsername: user.itchUsername,
    itchAvatar: user.image,
  }
})

const ProfileSchema = object({
  name: pipe(
    string(),
    nonEmpty('Display name is required'),
    minLength(2, 'Display name must be at least 2 characters'),
    maxLength(30, 'Display name must be 30 characters or less'),
  ),
  avatarLink: pipe(string(), nonEmpty('Avatar is required')),
})

const profileHandler = async (data: { name: string; avatarLink: string }) => {
  const result = safeParse(ProfileSchema, data)
  if (!result.success) {
    return {
      status: 'error' as const,
      message: result.issues[0]?.message ?? 'Invalid form data',
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
}

export const setupProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; avatarLink: string }) => data)
  .handler(({ data }) => profileHandler(data))

export const updateProfileFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { name: string; avatarLink: string }) => data)
  .handler(({ data }) => profileHandler(data))
