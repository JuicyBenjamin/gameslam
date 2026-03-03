import { createFileRoute } from '@tanstack/react-router'

interface IHealthStatus {
  status: 'healthy'
  timestamp: string
}

const HealthCheckPage = () => {
  const healthStatus = Route.useLoaderData()
  return <pre className="p-4 font-mono text-sm">{JSON.stringify(healthStatus, null, 2)}</pre>
}

export const Route = createFileRoute('/health/')({
  loader: async () => {
    const healthStatus: IHealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    }
    return healthStatus
  },
  component: HealthCheckPage,
})
