import { useLoaderData, Link } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Gamepad2, Trophy, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { slamsCollection } from '@/collections'
import { UserSlamCard } from './components/user-slam-card'

export const CreatedSlamsSection = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const userId = loaderData.user?.id

  const { data: userSlams = [] } = useLiveQuery(query =>
    query
      .from({ slamItem: slamsCollection })
      .where(({ slamItem }) => eq(slamItem.slam.createdBy, userId))
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
        <div className="text-center py-12">
          <Trophy className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No slams created yet</h3>
          <p className="text-muted-foreground mb-6">This user hasn't created any slams yet.</p>
          <Button asChild>
            <Link to="/slams/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Slam
            </Link>
          </Button>
        </div>
      )}
    </section>
  )
}
