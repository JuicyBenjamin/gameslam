import { createServerFn } from '@tanstack/react-start'

export const fetchItchOAuthUrl = createServerFn({ method: 'GET' }).handler(async () => {
  const clientId = process.env.ITCH_CLIENT_ID
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  const redirectUri = `${baseUrl}/auth/itch/callback`

  if (clientId == null || clientId === '') {
    throw new Error('ITCH_CLIENT_ID is not configured')
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: 'profile:me',
    response_type: 'token',
    redirect_uri: redirectUri,
  })

  return `https://itch.io/user/oauth?${params.toString()}`
})
