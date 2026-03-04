import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Clock, Gamepad2, Target } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { slamsCollection, slamEntriesCollection } from '@/collections'

interface IActivityItem {
  type: 'slam_created' | 'entry_submitted'
  title: string
  time: Date
}

function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const diffWeeks = Math.floor(diffDays / 7)

  if (diffMinutes < 1) return 'just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const RecentActivity = () => {
  const loaderData = useLoaderData({ from: '/_user-profile/$userName/' })
  const userId = loaderData.user?.id

  const { data: userSlams = [] } = useLiveQuery(query =>
    query.from({ slamItem: slamsCollection }).where(({ slamItem }) => eq(slamItem.slam.createdBy, userId)),
  )

  const { data: userEntries = [] } = useLiveQuery(query =>
    query.from({ entryItem: slamEntriesCollection }).where(({ entryItem }) => eq(entryItem.entry.userId, userId)),
  )

  const slamActivities: Array<IActivityItem> = (userSlams.length > 0 ? userSlams : loaderData.slams.map((slam: any) => ({ slam }))).map(
    (item: any) => ({
      type: 'slam_created' as const,
      title: `Created "${item.slam?.name ?? item.name}"`,
      time: new Date(item.slam?.createdAt ?? item.createdAt),
    }),
  )

  const entryActivities: Array<IActivityItem> = (userEntries.length > 0 ? userEntries : loaderData.entries).map(
    (item: any) => ({
      type: 'entry_submitted' as const,
      title: `Submitted entry "${item.entry?.name ?? item.name}"`,
      time: new Date(item.entry?.createdAt ?? item.createdAt),
    }),
  )

  const activities = [...slamActivities, ...entryActivities]
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 8)

  if (activities.length === 0) return null

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Clock className="h-6 w-6 text-primary" />
          Recent Activity
        </h2>
      </div>

      <Card className="bg-linear-to-br from-muted to-muted/80">
        <CardContent className="p-6">
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const IconComponent = activity.type === 'slam_created' ? Gamepad2 : Target
              const iconColor = activity.type === 'slam_created' ? 'text-primary' : 'text-accent'

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
                >
                  <div className="p-2 rounded-full bg-card shadow-sm">
                    <IconComponent className={`h-4 w-4 ${iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{formatRelativeTime(activity.time)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
