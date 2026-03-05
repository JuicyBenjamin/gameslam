import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Gamepad2, Target, Zap, Award } from 'lucide-react'
import { slamsCollection, slamEntriesCollection } from '@/collections'

const TOTAL_ACHIEVEMENTS = 6

export const StatsGrid = () => {
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

  const activeSlamsCount = userSlams.length > 0
    ? userSlams.filter(slamItem => !slamItem.slam.isDeleted).length
    : loaderData.slams.filter((slam: any) => !slam.isDeleted).length

  const earnedCount = [
    slamsCount > 0,
    slamsCount >= 5,
    slamsCount >= 10,
    entriesCount > 0,
    entriesCount >= 10,
    entriesCount >= 25,
  ].filter(Boolean).length

  const stats = [
    { value: slamsCount, label: 'Slams Created', icon: Gamepad2 },
    { value: entriesCount, label: 'Entries', icon: Target },
    { value: activeSlamsCount, label: 'Active Slams', icon: Zap },
    { value: earnedCount, label: 'Achievements', icon: Award },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8 lg:mt-0">
      {stats.map(stat => (
        <div key={stat.label} className="text-center p-4 bg-card/60 rounded-xl backdrop-blur-sm border">
          <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
            <stat.icon className="h-4 w-4" />
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  )
}
