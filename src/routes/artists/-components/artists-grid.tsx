import { useLiveQuery } from '@tanstack/react-db'
import { Palette } from 'lucide-react'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription } from '@/components/ui/empty'
import { artistsCollection } from '@/collections'
import { ArtistCard } from './artist-card'

export const ArtistsGrid = () => {
  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).orderBy(({ artistItem }) => artistItem.artist.name, 'asc'),
  )

  if (artists.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Palette />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No artists yet</EmptyTitle>
          <EmptyDescription>
            Artists will appear here as they join and participate in game slams.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
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
