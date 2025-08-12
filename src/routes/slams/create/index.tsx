import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/slams/create/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/slams/create/"!</div>
}
