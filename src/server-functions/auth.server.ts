import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth.server'

export const getSession = async () => {
  const headers = getRequestHeaders()
  return auth.api.getSession({ headers })
}
