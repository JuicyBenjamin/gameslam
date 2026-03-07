import { useLoaderData } from '@tanstack/react-router'
import { useLiveQuery, eq } from '@tanstack/react-db'
import { Trophy, Crown, Medal, Star, Flame, Award } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { slamsCollection, slamEntriesCollection } from '@/collections'
import { AchievementCard } from './components/achievement-card'

function buildAchievements(slamsCount: number, entriesCount: number) {
  return [
    { id: 1, name: 'First Slam', description: 'Created your first slam', icon: Trophy, earned: slamsCount > 0, rarity: 'common' as const },
    { id: 2, name: 'Active Creator', description: 'Created 5+ slams', icon: Crown, earned: slamsCount >= 5, rarity: 'rare' as const },
    { id: 3, name: 'Slam Master', description: 'Created 10+ slams', icon: Medal, earned: slamsCount >= 10, rarity: 'epic' as const },
    { id: 4, name: 'First Entry', description: 'Submitted your first entry', icon: Star, earned: entriesCount > 0, rarity: 'common' as const },
    { id: 5, name: 'Active Participant', description: 'Submitted 10+ entries', icon: Flame, earned: entriesCount >= 10, rarity: 'rare' as const },
    { id: 6, name: 'Slam Legend', description: 'Submitted 25+ entries', icon: Award, earned: entriesCount >= 25, rarity: 'legendary' as const },
  ]
}

export const AchievementsSection = () => {
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

  const achievements = buildAchievements(slamsCount, entriesCount)
  const earnedCount = achievements.filter(achievement => achievement.earned).length

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Achievements
        </h2>
        <Badge variant="secondary">
          {earnedCount}/{achievements.length} earned
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            name={achievement.name}
            description={achievement.description}
            icon={achievement.icon}
            earned={achievement.earned}
            rarity={achievement.rarity}
          />
        ))}
      </div>
    </section>
  )
}
