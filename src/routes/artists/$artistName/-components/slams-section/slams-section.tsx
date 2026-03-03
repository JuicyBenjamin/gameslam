import { useParams, useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Trophy } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { artistsCollection, slamsCollection } from '@/collections'
import { SlamCard } from './components/slam-card'

export const SlamsSection = () => {
  const { artistName } = useParams({ from: '/artists/$artistName/' })
  const loaderData = useLoaderData({ from: '/artists/$artistName/' })

  const { data: artists = [] } = useLiveQuery(query =>
    query.from({ artistItem: artistsCollection }).where(({ artistItem }) => eq(artistItem.artist.name, artistName)),
  )

  const artist = artists[0]?.artist || loaderData.artist
  const artistId = artist?.id

  const { data: artistSlams = [] } = useLiveQuery(query =>
    query
      .from({ slamItem: slamsCollection })
      .where(({ slamItem }) => eq(slamItem.slam.artistId, artistId))
      .orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  const slams =
    artistSlams.length > 0
      ? artistSlams.map(slamItem => ({
          ...slamItem.slam,
          entryCount: slamItem.entryCount,
          status: slamItem.slam.isDeleted ? 'deleted' : 'active',
        }))
      : loaderData.slams

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Created Slams</h2>
        <Badge variant="secondary">{slams.length} slams</Badge>
      </div>

      {slams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {slams.map((slam: any) => (
            <SlamCard key={slam.id} slam={slam} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No slams created yet</h3>
          <p className="text-muted-foreground">This artist hasn't created any slams yet.</p>
        </div>
      )}
    </section>
  )
}
