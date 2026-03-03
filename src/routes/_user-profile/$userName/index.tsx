import { createFileRoute } from '@tanstack/react-router'
import { getCurrentUser } from '@/server-functions/auth'
import { fetchUserProfile } from '@/server-functions/user-profile'
import { ProfileHero } from './-components/profile-hero'
import { AchievementsSection } from './-components/achievements-section'
import { PerformanceOverview } from './-components/performance-overview'
import { CreatedSlamsSection } from './-components/created-slams-section'
import { SlamEntriesSection } from './-components/slam-entries-section'
import { RecentActivity } from './-components/recent-activity'

export const Route = createFileRoute('/_user-profile/$userName/')({
  component: UserProfile,
  loader: async ({ params }) => {
    const [profileData, currentUser] = await Promise.all([
      fetchUserProfile({ data: { userName: params.userName } }),
      getCurrentUser(),
    ])
    return { ...profileData, currentUser }
  },
})

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-accent/10 dark:from-background dark:via-muted dark:to-accent/20">
      <ProfileHero />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AchievementsSection />
        <PerformanceOverview />
        <CreatedSlamsSection />
        <SlamEntriesSection />
        <RecentActivity />
      </main>
    </div>
  )
}
