import { createFileRoute } from '@tanstack/react-router'
import { ArtistsHeader } from './-components/artists-header'
import { ArtistsGrid } from './-components/artists-grid'

const ArtistsPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ArtistsHeader />
        <ArtistsGrid />
      </main>
    </div>
  )
}

export const Route = createFileRoute('/artists/')({
  component: ArtistsPage,
})
