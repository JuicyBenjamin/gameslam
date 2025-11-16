import { createFileRoute } from '@tanstack/react-router'

interface HealthStatus {
  status: 'healthy'
  timestamp: string
}

export const Route = createFileRoute('/health/')({
  loader: async () => {
    const healthStatus: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }
    return healthStatus
  },
  component: HealthCheck,
})

function HealthCheck() {
  const healthStatus = Route.useLoaderData()
  return <pre className="p-4 font-mono text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
}
