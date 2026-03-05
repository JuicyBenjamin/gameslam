import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { BarChart3, TrendingUp, Target, Zap, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { slamsCollection, slamEntriesCollection } from '@/collections'

export const PerformanceOverview = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const userId = loaderData.user?.id

  const { data: userSlams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.creatorId, userId)),
  )

  const { data: userEntries = [] } = useLiveQuery(query =>
    query.from({ entryItem: slamEntriesCollection }).where(({ entryItem }) => eq(entryItem.entry.userId, userId)),
  )

  const slamsCount = userSlams.length || loaderData.slams.length
  const entriesCount = userEntries.length || loaderData.entries.length

  const activeSlams = userSlams.length > 0
    ? userSlams.filter(slamItem => !slamItem.slam.isDeleted).length
    : loaderData.slams.filter((slam: any) => !slam.isDeleted).length

  const completedSlams = userSlams.length > 0
    ? userSlams.filter(slamItem => slamItem.slam.isDeleted).length
    : loaderData.slams.filter((slam: any) => slam.isDeleted).length

  const successRate = slamsCount > 0 ? Math.round((completedSlams / slamsCount) * 100) : 0
  const averageEntriesPerSlam = slamsCount > 0 ? Math.round((entriesCount / slamsCount) * 10) / 10 : 0

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          Performance Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Success Rate</p>
                <p className="text-2xl font-bold text-foreground">{successRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/10 to-accent/20 border-accent/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-foreground">Avg. Entries/Slam</p>
                <p className="text-2xl font-bold text-foreground">{averageEntriesPerSlam}</p>
              </div>
              <Target className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 to-primary/15 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-primary">Active Slams</p>
                <p className="text-2xl font-bold text-foreground">{activeSlams}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-accent/5 to-accent/15 border-accent/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-accent-foreground">Total Activity</p>
                <p className="text-2xl font-bold text-foreground">{slamsCount + entriesCount}</p>
              </div>
              <Heart className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
