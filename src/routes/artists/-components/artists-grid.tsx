import { useLiveQuery } from '@tanstack/react-db'
import { Palette } from 'lucide-react'
import { artistsCollection } from '@/collections'
import { ArtistCard } from './artist-card'

export const ArtistsGrid = () => {
  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).orderBy(({ artistItem }) => artistItem.artist.name, 'asc'),
  )

  if (artists.length === 0) {
    return (
      <div className="text-center py-12">
        <Palette className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No artists yet</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Artists will appear here as they join and participate in game slams.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {artists.map((item) => (
        <ArtistCard
          key={item.artist.id}
          artist={item.artist}
          assetCount={Number(item.assetCount)}
        />
      ))}
    </div>
  )
}
