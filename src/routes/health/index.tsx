import { createFileRoute } from '@tanstack/react-router'

interface HealthStatus {
  status: 'healthy'
  timestamp: string
}

export const Route = createFileRoute('/health/')({
  server: {
    handlers: {
      GET: async () => {
        const healthStatus: HealthStatus = {
          status: 'healthy',
          timestamp: new Date().toISOString(),
        }

        return new Response(JSON.stringify(healthStatus), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      },
    },
  },
})
