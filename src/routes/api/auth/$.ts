import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const { auth } = await import('@/lib/auth.server')
        return auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        const url = new URL(request.url)

        if (url.pathname === '/api/auth/itch/verify') {
          const { handleItchVerify } = await import(
            '@/server-functions/itch-auth.server'
          )
          return handleItchVerify(request)
        }

        const { auth } = await import('@/lib/auth.server')
        return auth.handler(request)
      },
    },
  },
})
