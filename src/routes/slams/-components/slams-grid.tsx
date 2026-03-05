import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery } from '@tanstack/react-db'
import { Gamepad2, Plus } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { slamsCollection } from '@/collections'
import { SlamCard } from './slam-card'

export const SlamsGrid = () => {
  const { slams: initialSlams } = useLoaderData({ from: '/slams/' })

  const { data: slams = initialSlams } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  if (slams.length === 0) {
    return (
      <Empty>
        <EmptyMedia variant="icon">
          <Gamepad2 />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>No game slams yet</EmptyTitle>
          <EmptyDescription>
            Be the first to create a game slam and challenge the community with your creative theme.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <ButtonLink to="/slams/create">
            <Plus className="mr-2 h-4 w-4" />
            Create your first Slam
          </ButtonLink>
        </EmptyContent>
      </Empty>
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
