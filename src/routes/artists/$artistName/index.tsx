import { createFileRoute } from '@tanstack/react-router'
import { fetchArtistProfile } from '@/server-functions/artist-profile'
import { ArtistHeader } from './-components/artist-header'
import { AssetsSection } from './-components/assets-section'
import { SlamsSection } from './-components/slams-section'

const ArtistProfile = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      <ArtistHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AssetsSection />
        <SlamsSection />
      </main>
    </div>
  )
}

export const Route = createFileRoute('/artists/$artistName/')({
  component: ArtistProfile,
  loader: async ({ params }) => {
    return await fetchArtistProfile({ data: { artistName: params.artistName } })
  },
})
