import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getCurrentUser } from '@/loaders/auth'
import { fetchSlamDetails } from '@/server-functions/slam-show'
import { SlamHero } from './-components/slam-hero'
import { SlamStats } from './-components/slam-stats'
import { FeaturedAsset } from './-components/featured-asset'
import { RecentEntries } from './-components/recent-entries'
import { JoinSlamCard } from './-components/join-slam-card'
import { ViewAssetCard } from './-components/view-asset-card'
import { SlamDetailsCard } from './-components/slam-details-card'
import { ShareSection } from './-components/share-section'

export const Route = createFileRoute('/slams/show/$id/')({
  component: SlamShowPage,
  loader: async ({ params }) => {
    const [slam, user] = await Promise.all([
      fetchSlamDetails({ data: { slamId: params.id } }),
      getCurrentUser(),
    ])
    return { slam, user }
  },
})

function SlamShowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/slams">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Slams
            </Link>
          </Button>
        </div>

        <SlamHero />

        <div className="mb-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <SlamStats />
            <FeaturedAsset />
            <RecentEntries />
          </div>

          <div className="space-y-6">
            <JoinSlamCard />
            <ViewAssetCard />
            <SlamDetailsCard />
          </div>
        </div>

        <ShareSection />
      </main>
    </div>
  )
}
