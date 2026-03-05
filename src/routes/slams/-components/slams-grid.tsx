import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { Gamepad2, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { slamsCollection } from '@/collections'
import { SlamCard } from './slam-card'

export const SlamsGrid = () => {
  const { slams: initialSlams } = useLoaderData({ from: '/slams/' })

  const { data: slams = initialSlams } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  if (slams.length === 0) {
    return (
      <div className="text-center py-12">
        <Gamepad2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No game slams yet</h3>
        <p className="text-muted-foreground mb-6">
          Be the first to create a game slam and challenge the community with your creative theme.
        </p>
        <ButtonLink to="/slams/create">
          <Plus className="mr-2 h-4 w-4" />
          Create your first Slam
        </ButtonLink>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {slams.map((slamData) => (
        <SlamCard
          key={slamData.slam.id}
          slam={slamData.slam}
          artist={slamData.artist}
          creator={slamData.creator}
          entryCount={slamData.entryCount}
        />
      ))}
    </div>
  )
}
