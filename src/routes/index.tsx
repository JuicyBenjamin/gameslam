import { createFileRoute } from '@tanstack/react-router'
import { getCurrentUser } from '@/loaders/auth'
import { fetchFeaturedContent } from '@/server-functions/index'
import { HeroSection } from './-home-components/hero-section'
import { FeaturedSlamsSection } from './-home-components/featured-slams-section'
import { TopArtistsSection } from './-home-components/top-artists-section'
import { FeaturedAssetsSection } from './-home-components/featured-assets-section'
import { LatestEntriesSection } from './-home-components/latest-entries-section'
import { CallToAction } from './-home-components/call-to-action'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <FeaturedSlamsSection />
      <TopArtistsSection />
      <FeaturedAssetsSection />
      <LatestEntriesSection />
      <CallToAction />
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: async () => {
    const [featuredContent, user] = await Promise.all([fetchFeaturedContent(), getCurrentUser()])
    return { featuredContent, user }
  },
})
