import { randomBytes, randomUUID } from 'node:crypto'
import { prisma } from '@/lib/prisma.server'
import { auth } from '@/lib/auth.server'

interface IItchProfile {
  user: {
    id: number
    username: string
    display_name: string
    cover_url: string
    url: string
    gamer: boolean
    developer: boolean
    press_user: boolean
  }
}

interface IItchVerifyResult {
  status: 'success' | 'error'
  message?: string
  sessionToken?: string
  isNewUser?: boolean
}

async function signCookieValue(value: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await globalThis.crypto.subtle.sign('HMAC', key, encoder.encode(value))
  const base64Sig = btoa(String.fromCharCode(...new Uint8Array(signature)))
  return encodeURIComponent(`${value}.${base64Sig}`)
}

export async function handleItchVerify(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as { accessToken?: string }

    if (body.accessToken == null || body.accessToken === '') {
      return Response.json({ status: 'error', message: 'Missing access token' }, { status: 400 })
    }

    const result = await verifyItchToken(body.accessToken)

    if (result.status === 'error' || result.sessionToken == null) {
      return Response.json({ status: 'error', message: result.message }, { status: 401 })
    }

    const ctx = await auth.$context
    const signedValue = await signCookieValue(result.sessionToken, ctx.secret)
    const { name: cookieName, attributes } = ctx.authCookies.sessionToken

    const cookieParts = [
      `${cookieName}=${signedValue}`,
      `Path=${attributes.path ?? '/'}`,
      attributes.httpOnly ? 'HttpOnly' : '',
      `SameSite=${attributes.sameSite ?? 'Lax'}`,
      `Max-Age=${attributes.maxAge ?? 7 * 24 * 60 * 60}`,
      attributes.secure ? 'Secure' : '',
    ]
      .filter(Boolean)
      .join('; ')

    return new Response(JSON.stringify({ status: 'success', isNewUser: result.isNewUser }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieParts,
      },
    })
  } catch (error) {
    console.error('[itch-auth] Unhandled error in handleItchVerify:', error)
    return Response.json({ status: 'error', message: 'Internal server error' }, { status: 500 })
  }
}

const verifyItchToken = async (accessToken: string): Promise<IItchVerifyResult> => {
  const profileResponse = await fetch('https://itch.io/api/1/key/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!profileResponse.ok) {
    return { status: 'error', message: 'Invalid itch.io access token' }
  }

  const profileData = (await profileResponse.json()) as IItchProfile
  const itchUser = profileData.user

  if (itchUser?.id == null) {
    return { status: 'error', message: 'Could not retrieve itch.io profile' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { itchId: itchUser.id },
  })

  const isNewUser = existingUser == null
  const placeholderEmail = `${itchUser.username}@itch.io`

  const user = isNewUser
    ? await prisma.user.create({
        data: {
          id: randomUUID(),
          name: itchUser.username,
          email: placeholderEmail,
          emailVerified: false,
          image: itchUser.cover_url ?? null,
          itchId: itchUser.id,
          itchUsername: itchUser.username,
        },
      })
    : await prisma.user.update({
        where: { itchId: itchUser.id },
        data: {
          itchUsername: itchUser.username,
          image: existingUser.image ?? itchUser.cover_url ?? null,
        },
      })

  const existingAccount = await prisma.account.findFirst({
    where: { providerId: 'itch', accountId: String(itchUser.id) },
  })

  if (existingAccount != null) {
    await prisma.account.update({
      where: { id: existingAccount.id },
      data: { accessToken },
    })
  } else {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        userId: user.id,
        accountId: String(itchUser.id),
        providerId: 'itch',
        accessToken,
      },
    })
  }

  const sessionToken = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: {
      id: randomUUID(),
      userId: user.id,
      token: sessionToken,
      expiresAt,
    },
  })

  return { status: 'success', sessionToken, isNewUser }
}
