import { createFileRoute } from '@tanstack/react-router'
import { fetchSlams } from '@/server-functions/slams'
import { SlamsHeader } from './-components/slams-header'
import { SlamsGrid } from './-components/slams-grid'

const SlamsPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SlamsHeader />
        <SlamsGrid />
      </main>
    </div>
  )
}

export const Route = createFileRoute('/slams/')({
  component: SlamsPage,
  loader: async () => {
    const slams = await fetchSlams()
    return { slams }
  },
})
