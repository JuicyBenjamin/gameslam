import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Gamepad2, Trophy, Plus } from 'lucide-react'
import { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { ButtonLink } from '@/components/ui/button-link'
import { Badge } from '@/components/ui/badge'
import { slamsCollection } from '@/collections'
import { UserSlamCard } from './components/user-slam-card'

export const CreatedSlamsSection = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const userId = loaderData.user?.id

  const { data: userSlams = [] } = useLiveQuery(query =>
    query
      .from({ slamItem: slamsCollection })
      .where(({ slamItem }) => eq(slamItem.slam.creatorId, userId))
      .orderBy(({ slamItem }) => slamItem.slam.createdAt, 'desc'),
  )

  const slams =
    userSlams.length > 0
      ? userSlams.map(slamItem => ({
          ...slamItem.slam,
          entryCount: slamItem.entryCount,
          status: slamItem.slam.isDeleted ? 'deleted' : 'active',
        }))
      : loaderData.slams.map((slam: any) => ({
          ...slam,
          entryCount: 0,
          status: slam.isDeleted ? 'deleted' : 'active',
        }))

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Gamepad2 className="h-6 w-6 text-primary" />
          Created Slams
        </h2>
        <Badge variant="secondary">{slams.length} slams</Badge>
      </div>

      {slams.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {slams.map((slam: any) => (
            <UserSlamCard key={slam.id} slam={slam} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyMedia variant="icon">
            <Trophy />
          </EmptyMedia>
          <EmptyHeader>
            <EmptyTitle>No slams created yet</EmptyTitle>
            <EmptyDescription>This user hasn't created any slams yet.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <ButtonLink to="/slams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Slam
            </ButtonLink>
          </EmptyContent>
        </Empty>
      )}
    </section>
  )
}
