import { createFileRoute } from '@tanstack/react-router'

const CreateSlamPage = () => {
  return <div>Hello "/slams/create/"!</div>
}

export const Route = createFileRoute('/slams/create/')({
  component: CreateSlamPage,
})
