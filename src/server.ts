import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

export default createServerEntry({
  async fetch(request) {
    const url = new URL(request.url)

    if (url.pathname.startsWith('/api/auth')) {
      const { auth } = await import('@/lib/auth.server')
      return auth.handler(request)
    }

    return handler.fetch(request)
  },
})
